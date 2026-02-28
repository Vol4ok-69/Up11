using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Team;
using Up11.Api.Helpers;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TeamService(DataBaseContext context) : ITeamService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TeamReadDto>> GetAllAsync()
    {
        return await _context.Teams
            .Include(t => t.Discipline)
            .Include(t => t.Captain)
            .Select(t => new TeamReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Discipline = t.Discipline.Title,
                Captain = t.Captain.Nickname
            })
            .ToListAsync();
    }

    public async Task<TeamReadDto> GetByIdAsync(int id)
    {
        return await _context.Teams
            .Include(t => t.Discipline)
            .Include(t => t.Captain)
            .Where(t => t.Id == id)
            .Select(t => new TeamReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Discipline = t.Discipline.Title,
                Captain = t.Captain.Nickname
            })
            .FirstOrDefaultAsync()
            ?? throw new KeyNotFoundException("Команда не найдена");
    }

    public async Task CreateAsync(TeamCreateDto dto, int currentUserId, string role)
    {
        var roleLevel = RoleHierarchy.GetLevel(role);

        if (roleLevel < (int)RoleLevel.Player)
            throw new UnauthorizedAccessException("Недостаточно прав");

        if (await _context.Teams.AnyAsync(t => t.Title == dto.Title))
            throw new ArgumentException("Команда с таким названием уже существует");

        int captainId;

        if (roleLevel < (int)RoleLevel.Organizer)
        {
            captainId = currentUserId;
        }
        else
        {
            if (!dto.CaptainId.HasValue)
                throw new ArgumentException("Необходимо указать CaptainId");

            var captainExists = await _context.Users
                .AnyAsync(u => u.Id == dto.CaptainId.Value);

            if (!captainExists)
                throw new ArgumentException("Указанный капитан не найден");

            captainId = dto.CaptainId.Value;
        }

        var disciplineExists = await _context.Disciplines
            .AnyAsync(d => d.Id == dto.DisciplineId);

        if (!disciplineExists)
            throw new ArgumentException("Дисциплина не найдена");

        var team = new Team
        {
            Title = dto.Title,
            DisciplineId = dto.DisciplineId,
            CaptainId = captainId,
            CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, int currentUserId, string role)
    {
        var team = await _context.Teams.FindAsync(id)
            ?? throw new KeyNotFoundException("Команда не найдена");

        var roleLevel = RoleHierarchy.GetLevel(role);

        var isCaptain = team.CaptainId == currentUserId;
        var isAdmin = roleLevel >= (int)RoleLevel.Administrator;

        if (!isCaptain && !isAdmin)
            throw new UnauthorizedAccessException("Недостаточно прав");

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
    }
}
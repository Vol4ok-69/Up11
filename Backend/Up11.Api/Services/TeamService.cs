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

        var participatesInTournament = await _context.TournamentParticipants
            .AnyAsync(tp =>
                tp.TeamId == id &&
                !tp.IsDeleted);

        if (participatesInTournament)
            throw new ArgumentException(
                "Нельзя удалить команду, участвующую в турнире");

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
    }
    public async Task UpdateAsync(int id, TeamUpdateDto dto, int currentUserId, string role)
    {
        var team = await _context.Teams
            .FirstOrDefaultAsync(t => t.Id == id)
            ?? throw new KeyNotFoundException("Команда не найдена");

        var roleLevel = RoleHierarchy.GetLevel(role);

        var isCaptain = team.CaptainId == currentUserId;
        var isAdmin = roleLevel >= (int)RoleLevel.Administrator;

        if (!isCaptain && !isAdmin)
            throw new UnauthorizedAccessException("Недостаточно прав");

        if (dto.Title != null)
        {
            if (await _context.Teams.AnyAsync(t => t.Title == dto.Title && t.Id != id))
                throw new ArgumentException("Команда с таким названием уже существует");

            team.Title = dto.Title;
        }

        if (dto.DisciplineId.HasValue)
        {
            var participatesInTournament = await _context.TournamentParticipants
                .AnyAsync(tp =>
                    tp.TeamId == id &&
                    !tp.IsDeleted);

            if (participatesInTournament)
                throw new ArgumentException(
                    "Нельзя менять дисциплину команды, участвующей в турнире");

            var disciplineExists = await _context.Disciplines
                .AnyAsync(d => d.Id == dto.DisciplineId.Value);

            if (!disciplineExists)
                throw new ArgumentException("Дисциплина не найдена");

            team.DisciplineId = dto.DisciplineId.Value;
        }

        if (dto.CaptainId.HasValue)
        {
            var captainExists = await _context.Users
                .AnyAsync(u => u.Id == dto.CaptainId.Value);

            if (!captainExists)
                throw new ArgumentException("Указанный капитан не найден");

            var isMember = await _context.TeamMembers
                .AnyAsync(tm =>
                    tm.TeamId == id &&
                    tm.UserId == dto.CaptainId.Value);

            if (!isMember)
                throw new ArgumentException("Новый капитан должен состоять в команде");

            team.CaptainId = dto.CaptainId.Value;
        }

        await _context.SaveChangesAsync();
    }
}
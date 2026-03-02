using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Tournament;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TournamentService(DataBaseContext context) : ITournamentService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TournamentReadDto>> GetAllAsync()
    {
        return await _context.Tournaments
            .Where(t => !t.IsDeleted)
            .Include(t => t.Discipline)
            .Include(t => t.Status)
            .Select(t => new TournamentReadDto
            {
                Id = t.Id,
                Title = t.Title,
                Discipline = t.Discipline.Title,
                StartDate = t.StartDate,
                EndDate = t.EndDate,
                PrizePool = t.PrizePool,
                MinTeamSize = t.MinTeamSize,
                Status = t.Status.Title
            })
            .ToListAsync();
    }

    public async Task<TournamentReadDto> GetByIdAsync(int id)
    {
        var tournament = await _context.Tournaments
            .Include(t => t.Discipline)
            .Include(t => t.Status)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        return new TournamentReadDto
        {
            Id = tournament.Id,
            Title = tournament.Title,
            Discipline = tournament.Discipline.Title,
            StartDate = tournament.StartDate,
            EndDate = tournament.EndDate,
            PrizePool = tournament.PrizePool,
            MinTeamSize = tournament.MinTeamSize,
            Status = tournament.Status.Title
        };
    }

    public async Task CreateAsync(TournamentCreateDto dto, int currentUserId)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("Название турнира не указано");

        var tournament = new Tournament
        {
            Title = dto.Title,
            DisciplineId = dto.DisciplineId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            PrizePool = dto.PrizePool,
            MinTeamSize = dto.MinTeamSize,
            StatusId = dto.StatusId,
            OrganizerId = currentUserId
        };

        _context.Tournaments.Add(tournament);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, TournamentUpdateDto dto, int currentUserId, string role)
    {
        var tournament = await _context.Tournaments
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        if (role != "Администратор" && tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        if (dto.Title != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Название турнира не может быть пустым");

            tournament.Title = dto.Title;
        }

        if (dto.StartDate.HasValue)
            tournament.StartDate = dto.StartDate.Value;

        if (dto.EndDate.HasValue)
            tournament.EndDate = dto.EndDate.Value;

        if (dto.PrizePool.HasValue)
            tournament.PrizePool = dto.PrizePool.Value;

        if (dto.MinTeamSize.HasValue)
            tournament.MinTeamSize = dto.MinTeamSize.Value;

        if (dto.StatusId.HasValue)
            tournament.StatusId = dto.StatusId.Value;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, int currentUserId, string role)
    {
        var tournament = await _context.Tournaments
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        if (role != "Администратор" && tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        tournament.IsDeleted = true;
        await _context.SaveChangesAsync();
    }
}
using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.TournamentParticipant;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TournamentParticipantService(DataBaseContext context) : ITournamentParticipantService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TournamentParticipantReadDto>> GetByTournamentAsync(int tournamentId)
    {
        return await _context.TournamentParticipants
            .Where(p => p.TournamentId == tournamentId && !p.IsDeleted)
            .Include(p => p.Team)
            .Include(p => p.Tournament)
            .Select(p => new TournamentParticipantReadDto
            {
                Id = p.Id,
                Tournament = p.Tournament.Title,
                Team = p.Team.Title
            })
            .ToListAsync();
    }

    public async Task AddAsync(TournamentParticipantCreateDto dto, int currentUserId, string role)
    {
        if (dto.TournamentId <= 0)
            throw new ArgumentException("Идентификатор турнира некорректен");

        if (dto.TeamId <= 0)
            throw new ArgumentException("Идентификатор команды некорректен");

        var tournament = await _context.Tournaments
            .FirstOrDefaultAsync(t => t.Id == dto.TournamentId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        var team = await _context.Teams
            .FirstOrDefaultAsync(t => t.Id == dto.TeamId)
            ?? throw new KeyNotFoundException("Команда не найдена");

        if (team.DisciplineId != tournament.DisciplineId)
            throw new ArgumentException("Дисциплина не совпадает");

        if (role != "Администратор" &&
            tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var exists = await _context.TournamentParticipants
            .AnyAsync(p =>
                p.TournamentId == dto.TournamentId &&
                p.TeamId == dto.TeamId);

        if (exists)
            throw new ArgumentException("Команда уже участвует в турнире");

        _context.TournamentParticipants.Add(new TournamentParticipant
        {
            TournamentId = dto.TournamentId,
            TeamId = dto.TeamId
        });

        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(int id, int currentUserId, string role)
    {
        var participant = await _context.TournamentParticipants
            .Include(p => p.Tournament)
            .Include(p => p.Team)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
            ?? throw new KeyNotFoundException("Участник не найден");

        var isOrganizer = participant.Tournament.OrganizerId == currentUserId;
        var isCaptain = participant.Team.CaptainId == currentUserId;

        if (role != "Администратор" && !isOrganizer && !isCaptain)
            throw new UnauthorizedAccessException("Недостаточно прав");

        participant.IsDeleted = true;

        await _context.SaveChangesAsync();
    }
}
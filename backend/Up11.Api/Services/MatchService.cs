using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Match;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class MatchService(DataBaseContext context, IBracketService _bracketService) : IMatchService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<MatchReadDto>> GetByTournamentAsync(int tournamentId)
    {
        return await _context.Matches
            .Where(m => m.TournamentId == tournamentId)
            .Include(m => m.Tournament)
            .Include(m => m.Stage)
            .Include(m => m.TeamA)
            .Include(m => m.TeamB)
            .Select(m => new MatchReadDto
            {
                Id = m.Id,
                Tournament = m.Tournament.Title,
                TeamA = m.TeamA.Title,
                TeamB = m.TeamB.Title,
                MatchDate = m.MatchDate,
                Stage = m.Stage.Title,
                IsFinished = m.IsFinished
            })
            .ToListAsync();
    }

    public async Task CreateAsync(MatchCreateDto dto, int currentUserId, string role)
    {
        var tournament = await _context.Tournaments
            .FirstOrDefaultAsync(t => t.Id == dto.TournamentId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        if (role != "Администратор" &&
            tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        if (dto.TeamAId == dto.TeamBId)
            throw new ArgumentException("Команды не могут совпадать");

        var participants = await _context.TournamentParticipants
            .Where(p => p.TournamentId == dto.TournamentId && !p.IsDeleted)
            .Select(p => p.TeamId)
            .ToListAsync();

        if (!participants.Contains(dto.TeamAId) ||
            !participants.Contains(dto.TeamBId))
            throw new ArgumentException("Обе команды должны участвовать в турнире");

        var match = new Match
        {
            TournamentId = dto.TournamentId,
            TeamAId = dto.TeamAId,
            TeamBId = dto.TeamBId,
            MatchDate = dto.MatchDate,
            StageId = dto.StageId,
            IsFinished = false
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();
    }

    public async Task AddResultAsync(int matchId, MatchResultCreateDto dto, int currentUserId, string role)
    {
        var match = await _context.Matches
            .Include(m => m.Tournament)
            .FirstOrDefaultAsync(m => m.Id == matchId)
            ?? throw new KeyNotFoundException("Матч не найден");

        if (role != "Администратор" &&
            match.Tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var exists = await _context.MatchResults
            .AnyAsync(r => r.MatchId == matchId);

        if (exists)
            throw new ArgumentException("Результат уже добавлен");

        match.IsFinished = true;

        int? winner = null;

        if (dto.ScoreTeamA > dto.ScoreTeamB)
            winner = match.TeamAId;
        else if (dto.ScoreTeamB > dto.ScoreTeamA)
            winner = match.TeamBId;

        _context.MatchResults.Add(new MatchResult
        {
            MatchId = matchId,
            ScoreTeamA = dto.ScoreTeamA,
            ScoreTeamB = dto.ScoreTeamB,
            WinnerTeamId = winner
        });

        await _context.SaveChangesAsync();
        await _bracketService.AdvanceWinnerAsync(matchId);
    }
}
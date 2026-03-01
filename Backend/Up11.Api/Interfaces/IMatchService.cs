using Up11.Api.DTOs.Match;

namespace Up11.Api.Interfaces;

public interface IMatchService
{
    Task<IEnumerable<MatchReadDto>> GetByTournamentAsync(int tournamentId);
    Task CreateAsync(MatchCreateDto dto, int currentUserId, string role);
    Task AddResultAsync(int matchId, MatchResultCreateDto dto, int currentUserId, string role);

}
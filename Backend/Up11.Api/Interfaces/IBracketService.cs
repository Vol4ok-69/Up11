using Up11.Api.DTOs.Bracket;
using Up11.Api.DTOs.Swiss;

namespace Up11.Api.Interfaces;

public interface IBracketService
{
    Task GenerateAsync(int tournamentId, int currentUserId, string role);
    Task AdvanceWinnerAsync(int matchId);
    Task GenerateNextSwissRound(int tournamentId);
    Task<List<BracketNodeDto>> GetBracketTreeAsync(int tournamentId);
    Task<List<SwissTableDto>> GetSwissTableAsync(int tournamentId);
}
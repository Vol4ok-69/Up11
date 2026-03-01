using Up11.Api.DTOs.TournamentApplication;

namespace Up11.Api.Interfaces;

public interface ITournamentApplicationService
{
    Task CreateAsync(TournamentApplicationCreateDto dto, int currentUserId, string role);
    Task UpdateStatusAsync(int id, int statusId, int currentUserId, string role);
    Task<IEnumerable<TournamentApplicationReadDto>> GetByTournamentAsync(int tournamentId);
    Task<IEnumerable<TournamentApplicationStatusHistoryDto>> GetHistoryAsync(int applicationId);
}
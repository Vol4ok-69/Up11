using Up11.Api.DTOs.TournamentParticipant;

namespace Up11.Api.Interfaces;

public interface ITournamentParticipantService
{
    Task<IEnumerable<TournamentParticipantReadDto>> GetByTournamentAsync(int tournamentId);
    Task AddAsync(TournamentParticipantCreateDto dto, int currentUserId, string role);
    Task RemoveAsync(int id, int currentUserId, string role);
}
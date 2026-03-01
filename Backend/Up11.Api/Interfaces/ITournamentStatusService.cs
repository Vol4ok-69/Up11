using Up11.Api.DTOs.TournamentStatus;

namespace Up11.Api.Interfaces;

public interface ITournamentStatusService
{
    Task<IEnumerable<TournamentStatusReadDto>> GetAllAsync();
    Task<TournamentStatusReadDto> GetByIdAsync(int id);
    Task CreateAsync(TournamentStatusCreateDto dto);
    Task UpdateAsync(int id, TournamentStatusUpdateDto dto);
    Task DeleteAsync(int id);
}
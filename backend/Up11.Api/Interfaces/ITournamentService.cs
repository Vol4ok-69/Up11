using Up11.Api.DTOs.Tournament;

namespace Up11.Api.Interfaces;

public interface ITournamentService
{
    Task<IEnumerable<TournamentReadDto>> GetAllAsync();
    Task<TournamentReadDto> GetByIdAsync(int id);
    Task CreateAsync(TournamentCreateDto dto, int currentUserId);
    Task UpdateAsync(int id, TournamentUpdateDto dto, int currentUserId, string role);
    Task DeleteAsync(int id, int currentUserId, string role);
}
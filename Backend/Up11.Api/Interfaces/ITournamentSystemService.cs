using Up11.Api.DTOs.TournamentSystem;

namespace Up11.Api.Interfaces;

public interface ITournamentSystemService
{
    Task<IEnumerable<TournamentSystemReadDto>> GetAllAsync();
    Task<TournamentSystemReadDto> GetByIdAsync(int id);
    Task CreateAsync(TournamentSystemCreateDto dto);
    Task UpdateAsync(int id, TournamentSystemUpdateDto dto);
    Task DeleteAsync(int id);
}
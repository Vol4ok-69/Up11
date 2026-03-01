using Up11.Api.DTOs.TournamentBracketType;

namespace Up11.Api.Interfaces;

public interface ITournamentBracketTypeService
{
    Task<IEnumerable<TournamentBracketTypeReadDto>> GetAllAsync();
    Task<TournamentBracketTypeReadDto> GetByIdAsync(int id);
    Task CreateAsync(TournamentBracketTypeCreateDto dto);
    Task UpdateAsync(int id, TournamentBracketTypeUpdateDto dto);
    Task DeleteAsync(int id);
}

using Up11.Api.DTOs.MatchStage;

namespace Up11.Api.Interfaces;

public interface IMatchStageService
{
    Task<IEnumerable<MatchStageReadDto>> GetAllAsync();
    Task<MatchStageReadDto> GetByIdAsync(int id);
    Task CreateAsync(MatchStageCreateDto dto);
    Task UpdateAsync(int id, MatchStageUpdateDto dto);
    Task DeleteAsync(int id);
}
using Up11.Api.DTOs.Team;

namespace Up11.Api.Interfaces;

public interface ITeamService
{
    Task<IEnumerable<TeamReadDto>> GetAllAsync();
    Task<TeamReadDto> GetByIdAsync(int id);
    Task CreateAsync(TeamCreateDto dto, int currentUserId, string role);
    Task DeleteAsync(int id, int currentUserId, string role);
}
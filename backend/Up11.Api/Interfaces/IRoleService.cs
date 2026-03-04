using Up11.Api.DTOs.Role;
using Up11.Api.Models;

namespace Up11.Api.Interfaces;

public interface IRoleService
{
    Task<IEnumerable<RoleReadDto>> GetAllAsync();
    Task<RoleReadDto> GetByIdAsync(int id);
    Task CreateAsync(RoleCreateDto dto);
    Task UpdateAsync(int id, RoleUpdateDto dto);
    Task DeleteAsync(int id);
}

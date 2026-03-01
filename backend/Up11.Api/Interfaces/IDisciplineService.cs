using Up11.Api.DTOs.Discipline;
using Up11.Api.Models;

namespace Up11.Api.Interfaces;

public interface IDisciplineService
{
    Task<IEnumerable<Discipline>> GetAllAsync();
    Task<Discipline> GetByIdAsync(int id);
    Task CreateAsync(DisciplineCreateDto dto);
    Task UpdateAsync(int id, DisciplineUpdateDto dto);
    Task DeleteAsync(int id);
}
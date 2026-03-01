using Up11.Api.DTOs.ApplicationStatus;

namespace Up11.Api.Interfaces;

public interface IApplicationStatusService
{
    Task<IEnumerable<ApplicationStatusReadDto>> GetAllAsync();
    Task<ApplicationStatusReadDto> GetByIdAsync(int id);
    Task CreateAsync(ApplicationStatusCreateDto dto);
    Task UpdateAsync(int id, ApplicationStatusUpdateDto dto);
    Task DeleteAsync(int id);
}
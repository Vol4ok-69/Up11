using Up11.Api.DTOs.User;

namespace Up11.Api.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserReadDto>> GetAllAsync();
    Task<UserReadDto?> GetByIdAsync(int id);

    Task UpdateAsync(int id, UserUpdateDto dto);
    Task DeleteAsync(int id);

    Task ChangePasswordAsync(int id, ChangePasswordDto dto, int currentUserId, string role);
    Task ChangeEmailAsync(int id, ChangeEmailDto dto, int currentUserId, string role);
    Task BlockAsync(int id);
    Task UnblockAsync(int id);
}
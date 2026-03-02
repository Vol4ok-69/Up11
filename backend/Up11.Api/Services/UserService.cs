using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.User;
using Up11.Api.Helpers;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class UserService(DataBaseContext context) : IUserService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<UserReadDto>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .Select(u => new UserReadDto
            {
                Id = u.Id,
                Login = u.Login,
                Nickname = u.Nickname,
                Role = u.Role.Title
            })
            .ToListAsync();
    }

    public async Task<UserReadDto?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Role)
            .Where(u => u.Id == id)
            .Select(u => new UserReadDto
            {
                Id = u.Id,
                Login = u.Login,
                Nickname = u.Nickname,
                Role = u.Role.Title
            })
            .FirstOrDefaultAsync()
            ?? throw new KeyNotFoundException("Пользователь не найден");
    }

    public async Task UpdateAsync(int id, UserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id)
            ?? throw new KeyNotFoundException("Пользователь не найден");

        if (dto.Nickname != null)
            user.Nickname = dto.Nickname;

        if (dto.RoleId.HasValue)
            user.RoleId = dto.RoleId.Value;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Пользователь не найден");

        if (user.IsDeleted)
            throw new ArgumentException("Пользователь уже удалён");

        var hasTeams = await _context.Teams.AnyAsync(t => t.CaptainId == id);
        if (hasTeams)
            throw new ArgumentException("Нельзя удалить пользователя, он является капитаном команды");

        user.IsDeleted = true;

        await _context.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(int id, ChangePasswordDto dto, int currentUserId, string role)
    {
        if (string.IsNullOrWhiteSpace(dto.OldPassword))
            throw new ArgumentException("Старый пароль не указан");

        if (string.IsNullOrWhiteSpace(dto.NewPassword))
            throw new ArgumentException("Новый пароль не указан");

        var currentLevel = RoleHierarchy.GetLevel(role);

        if (currentUserId != id && currentLevel < (int)RoleLevel.Administrator)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Пользователь не найден");

        user.PasswordHash = PasswordHelper.Hash(dto.NewPassword);

        await _context.SaveChangesAsync();
    }

    public async Task ChangeEmailAsync(int id, ChangeEmailDto dto, int currentUserId, string role)
    {
        if (string.IsNullOrWhiteSpace(dto.NewEmail))
            throw new ArgumentException("Email не указан");

        var currentLevel = RoleHierarchy.GetLevel(role);

        if (currentUserId != id && currentLevel < (int)RoleLevel.Administrator)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Пользователь не найден");

        if (await _context.Users.AnyAsync(u => u.Email == dto.NewEmail))
            throw new ArgumentException("Email уже используется");

        user.Email = dto.NewEmail;

        await _context.SaveChangesAsync();
    }

    public async Task BlockAsync(int id)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Пользователь не найден");

        if (user.IsDeleted)
            throw new ArgumentException("Нельзя заблокировать удалённого пользователя");

        if (user.IsBlocked)
            throw new ArgumentException("Пользователь уже заблокирован");

        user.IsBlocked = true;

        await _context.SaveChangesAsync();
    }

    public async Task UnblockAsync(int id)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Пользователь не найден");

        if (!user.IsBlocked)
            throw new ArgumentException("Пользователь не заблокирован");

        user.IsBlocked = false;

        await _context.SaveChangesAsync();
    }
}

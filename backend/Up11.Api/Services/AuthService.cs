using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Auth;
using Up11.Api.Helpers;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class AuthService(DataBaseContext context, IJwtTokenService jwtService) : IAuthService
{
    private readonly DataBaseContext _context = context;
    private readonly IJwtTokenService _jwtService = jwtService;

    public async Task RegisterAsync(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Login == dto.Login))
            throw new ArgumentException("Логин уже существует");

        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            throw new ArgumentException("Email уже существует");

        var guestRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Title == "Гость")
            ?? throw new KeyNotFoundException("Роль 'Гость' не найдена");

        var user = new User
        {
            Login = dto.Login,
            Email = dto.Email,
            PasswordHash = PasswordHelper.Hash(dto.Password),
            Nickname = dto.Nickname,
            RoleId = guestRole.Id,
            IsBlocked = false
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Login == dto.Login)
            ?? throw new UnauthorizedAccessException("Неверный логин или пароль");

        if (user.IsBlocked)
            throw new UnauthorizedAccessException("Пользователь заблокирован");

        if (!PasswordHelper.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Неверный логин или пароль");

        var token = _jwtService.GenerateToken(user, user.Role.Title);

        return new AuthResponseDto
        {
            Token = token
        };
    }
}
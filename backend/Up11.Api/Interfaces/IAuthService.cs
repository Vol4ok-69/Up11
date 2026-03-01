using Up11.Api.DTOs.Auth;

namespace Up11.Api.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}
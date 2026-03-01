namespace Up11.Api.DTOs.Auth;

public class RegisterDto
{
    public string Login { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Nickname { get; set; } = null!;
}
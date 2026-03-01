namespace Up11.Api.DTOs.User;

public class UserCreateDto
{
    public string Login { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Nickname { get; set; } = null!;
    public int RoleId { get; set; }
}

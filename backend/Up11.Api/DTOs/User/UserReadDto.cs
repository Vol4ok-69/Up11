namespace Up11.Api.DTOs.User;

public class UserReadDto
{
    public int Id { get; set; }
    public string Login { get; set; } = null!;
    public string Nickname { get; set; } = null!;
    public string Role { get; set; } = null!;
}
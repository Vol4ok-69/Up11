namespace Up11.Api.DTOs.User;

public class UserUpdateDto
{
    public string? Email { get; set; }
    public string? Nickname { get; set; }
    public int? RoleId { get; set; }
}
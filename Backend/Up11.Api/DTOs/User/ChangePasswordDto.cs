namespace Up11.Api.DTOs.User;

public class ChangePasswordDto
{
    public string OldPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
namespace Up11.Api.DTOs.TeamMember;

public class TeamMemberReadDto
{
    public int Id { get; set; }
    public string Team { get; set; } = null!;
    public string User { get; set; } = null!;
    public DateOnly JoinedAt { get; set; }
}
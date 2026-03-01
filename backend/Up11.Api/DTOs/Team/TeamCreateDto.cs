namespace Up11.Api.DTOs.Team;

public class TeamCreateDto
{
    public string Title { get; set; } = null!;
    public int DisciplineId { get; set; }
    public int? CaptainId { get; set; }
}
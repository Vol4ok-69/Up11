namespace Up11.Api.DTOs.Team;

public class TeamReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Discipline { get; set; } = null!;
    public string Captain { get; set; } = null!;
}
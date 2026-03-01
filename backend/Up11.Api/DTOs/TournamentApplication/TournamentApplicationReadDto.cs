namespace Up11.Api.DTOs.TournamentApplication;

public class TournamentApplicationReadDto
{
    public int Id { get; set; }
    public string Tournament { get; set; } = null!;
    public string Team { get; set; } = null!;
    public string Status { get; set; } = null!;
}
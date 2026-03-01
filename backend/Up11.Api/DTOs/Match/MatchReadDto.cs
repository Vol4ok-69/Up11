namespace Up11.Api.DTOs.Match;

public class MatchReadDto
{
    public int Id { get; set; }
    public string Tournament { get; set; } = null!;
    public string TeamA { get; set; } = null!;
    public string TeamB { get; set; } = null!;
    public DateTime MatchDate { get; set; }
    public string Stage { get; set; } = null!;
    public bool IsFinished { get; set; }
}
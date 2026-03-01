namespace Up11.Api.DTOs.Tournament;

public class TournamentReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Discipline { get; set; } = null!;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal PrizePool { get; set; }
    public int MinTeamSize { get; set; }
    public string Status { get; set; } = null!;
}
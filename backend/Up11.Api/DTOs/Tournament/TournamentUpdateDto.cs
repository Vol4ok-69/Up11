namespace Up11.Api.DTOs.Tournament;

public class TournamentUpdateDto
{
    public string? Title { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? PrizePool { get; set; }
    public int? MinTeamSize { get; set; }
    public int? StatusId { get; set; }
    public int SystemId { get; set; } = 1;
}
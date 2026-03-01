namespace Up11.Api.DTOs.Match;

public class MatchCreateDto
{
    public int TournamentId { get; set; }
    public int TeamAId { get; set; }
    public int TeamBId { get; set; }
    public DateTime MatchDate { get; set; }
    public int StageId { get; set; }
}
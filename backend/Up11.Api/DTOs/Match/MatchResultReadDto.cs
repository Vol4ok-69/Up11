namespace Up11.Api.DTOs.Match
{
    public class MatchResultReadDto
    {
        public int Id { get; set; }
        public string Match { get; set; } = null!;
        public int ScoreTeamA { get; set; }
        public int ScoreTeamB { get; set; }
        public string? WinnerTeam { get; set; }
        public DateTime ResultedAt { get; set; }
    }
}

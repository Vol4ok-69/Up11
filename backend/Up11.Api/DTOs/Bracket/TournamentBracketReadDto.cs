namespace Up11.Api.DTOs.Bracket
{
    public class TournamentBracketReadDto
    {
        public int Id { get; set; }

        public int TournamentId { get; set; }

        public int StageId { get; set; }

        public int Position { get; set; }

        public int? MatchId { get; set; }

        public int? ParentBracketId { get; set; }

        public int? SlotInParent { get; set; }

        public string BracketType { get; set; } = null!;
    }
}

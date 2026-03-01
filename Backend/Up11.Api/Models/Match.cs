using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class Match
{
    public int Id { get; set; }

    public int TournamentId { get; set; }

    public int TeamAId { get; set; }

    public int TeamBId { get; set; }

    public DateTime MatchDate { get; set; }

    public int StageId { get; set; }

    public bool IsFinished { get; set; }

    public virtual MatchResult? MatchResult { get; set; }

    public virtual MatchStage Stage { get; set; } = null!;

    public virtual Team TeamA { get; set; } = null!;

    public virtual Team TeamB { get; set; } = null!;

    public virtual Tournament Tournament { get; set; } = null!;

    public virtual ICollection<TournamentBracket> TournamentBrackets { get; set; } = new List<TournamentBracket>();
}

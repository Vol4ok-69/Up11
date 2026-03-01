using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class MatchStage
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<Match> Matches { get; set; } = new List<Match>();

    public virtual ICollection<TournamentBracket> TournamentBrackets { get; set; } = new List<TournamentBracket>();
}

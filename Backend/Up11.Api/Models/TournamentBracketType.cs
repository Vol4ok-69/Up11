using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TournamentBracketType
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<TournamentBracket> TournamentBrackets { get; set; } = new List<TournamentBracket>();
}

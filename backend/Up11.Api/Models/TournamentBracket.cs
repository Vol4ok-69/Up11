using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TournamentBracket
{
    public int Id { get; set; }

    public int TournamentId { get; set; }

    public int StageId { get; set; }

    public int Position { get; set; }

    public int? MatchId { get; set; }

    public int? ParentBracketId { get; set; }

    public int? SlotInParent { get; set; }

    public int BracketTypeId { get; set; }

    public virtual TournamentBracketType BracketType { get; set; } = null!;

    public virtual ICollection<TournamentBracket> InverseParentBracket { get; set; } = new List<TournamentBracket>();

    public virtual Match? Match { get; set; }

    public virtual TournamentBracket? ParentBracket { get; set; }

    public virtual MatchStage Stage { get; set; } = null!;

    public virtual Tournament Tournament { get; set; } = null!;
}

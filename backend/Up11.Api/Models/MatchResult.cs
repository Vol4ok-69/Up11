using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class MatchResult
{
    public int Id { get; set; }

    public int MatchId { get; set; }

    public int ScoreTeamA { get; set; }

    public int ScoreTeamB { get; set; }

    public int? WinnerTeamId { get; set; }

    public virtual Match Match { get; set; } = null!;

    public virtual Team? WinnerTeam { get; set; }
}

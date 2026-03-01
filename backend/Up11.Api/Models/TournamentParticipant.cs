using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TournamentParticipant
{
    public int Id { get; set; }

    public int TournamentId { get; set; }

    public int TeamId { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Team Team { get; set; } = null!;

    public virtual Tournament Tournament { get; set; } = null!;
}

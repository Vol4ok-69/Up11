using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TournamentApplication
{
    public int Id { get; set; }

    public int TournamentId { get; set; }

    public int TeamId { get; set; }

    public int StatusId { get; set; }

    public DateTime AppliedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ApplicationStatus Status { get; set; } = null!;

    public virtual Team Team { get; set; } = null!;

    public virtual Tournament Tournament { get; set; } = null!;

    public virtual ICollection<TournamentApplicationStatusHistory> TournamentApplicationStatusHistories { get; set; } = new List<TournamentApplicationStatusHistory>();
}

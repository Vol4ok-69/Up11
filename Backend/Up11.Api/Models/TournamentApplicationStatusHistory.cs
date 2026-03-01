using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TournamentApplicationStatusHistory
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }

    public int OldStatusId { get; set; }

    public int NewStatusId { get; set; }

    public int ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; }

    public virtual TournamentApplication Application { get; set; } = null!;

    public virtual User ChangedByUser { get; set; } = null!;

    public virtual ApplicationStatus NewStatus { get; set; } = null!;

    public virtual ApplicationStatus OldStatus { get; set; } = null!;
}

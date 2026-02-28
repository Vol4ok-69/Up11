using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class ApplicationStatus
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<TournamentApplication> TournamentApplications { get; set; } = new List<TournamentApplication>();
}

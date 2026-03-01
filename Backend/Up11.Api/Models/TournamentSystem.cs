using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TournamentSystem
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
}

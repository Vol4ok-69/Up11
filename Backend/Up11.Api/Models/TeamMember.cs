using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class TeamMember
{
    public int Id { get; set; }

    public int TeamId { get; set; }

    public int UserId { get; set; }

    public DateOnly JoinedAt { get; set; }

    public virtual Team Team { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

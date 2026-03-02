using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class User
{
    public int Id { get; set; }

    public string Login { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Nickname { get; set; }

    public int RoleId { get; set; }

    public bool IsBlocked { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();

    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();

    public virtual ICollection<TournamentApplicationStatusHistory> TournamentApplicationStatusHistories { get; set; } = new List<TournamentApplicationStatusHistory>();

    public virtual ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
}

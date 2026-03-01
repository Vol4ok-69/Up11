using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class Team
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int DisciplineId { get; set; }

    public int CaptainId { get; set; }

    public DateOnly CreatedAt { get; set; }

    public virtual User Captain { get; set; } = null!;

    public virtual Discipline Discipline { get; set; } = null!;

    public virtual ICollection<MatchResult> MatchResults { get; set; } = new List<MatchResult>();

    public virtual ICollection<Match> MatchTeamAs { get; set; } = new List<Match>();

    public virtual ICollection<Match> MatchTeamBs { get; set; } = new List<Match>();

    public virtual ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();

    public virtual ICollection<TournamentApplication> TournamentApplications { get; set; } = new List<TournamentApplication>();

    public virtual ICollection<TournamentParticipant> TournamentParticipants { get; set; } = new List<TournamentParticipant>();
}

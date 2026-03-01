using System;
using System.Collections.Generic;

namespace Up11.Api.Models;

public partial class Tournament
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int DisciplineId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public decimal PrizePool { get; set; }

    public int MinTeamSize { get; set; }

    public int StatusId { get; set; }

    public int OrganizerId { get; set; }

    public int SystemId { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Discipline Discipline { get; set; } = null!;

    public virtual ICollection<Match> Matches { get; set; } = new List<Match>();

    public virtual User Organizer { get; set; } = null!;

    public virtual TournamentStatus Status { get; set; } = null!;

    public virtual TournamentSystem System { get; set; } = null!;

    public virtual ICollection<TournamentApplication> TournamentApplications { get; set; } = new List<TournamentApplication>();

    public virtual ICollection<TournamentBracket> TournamentBrackets { get; set; } = new List<TournamentBracket>();

    public virtual ICollection<TournamentParticipant> TournamentParticipants { get; set; } = new List<TournamentParticipant>();
}

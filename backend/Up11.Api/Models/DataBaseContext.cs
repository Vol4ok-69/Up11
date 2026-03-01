using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Up11.Api.Models;

public partial class DataBaseContext : DbContext
{
    public DataBaseContext()
    {
    }

    public DataBaseContext(DbContextOptions<DataBaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ApplicationStatus> ApplicationStatuses { get; set; }

    public virtual DbSet<Discipline> Disciplines { get; set; }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<MatchResult> MatchResults { get; set; }

    public virtual DbSet<MatchStage> MatchStages { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamMember> TeamMembers { get; set; }

    public virtual DbSet<Tournament> Tournaments { get; set; }

    public virtual DbSet<TournamentApplication> TournamentApplications { get; set; }

    public virtual DbSet<TournamentApplicationStatusHistory> TournamentApplicationStatusHistories { get; set; }

    public virtual DbSet<TournamentBracket> TournamentBrackets { get; set; }

    public virtual DbSet<TournamentBracketType> TournamentBracketTypes { get; set; }

    public virtual DbSet<TournamentParticipant> TournamentParticipants { get; set; }

    public virtual DbSet<TournamentStatus> TournamentStatuses { get; set; }

    public virtual DbSet<TournamentSystem> TournamentSystems { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApplicationStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ApplicationStatuses_pkey");

            entity.HasIndex(e => e.Title, "ApplicationStatuses_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Discipline>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Disciplines_pkey");

            entity.HasIndex(e => e.Title, "Disciplines_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(100);
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Matches_pkey");

            entity.Property(e => e.IsFinished).HasDefaultValue(false);
            entity.Property(e => e.MatchDate).HasColumnType("timestamp without time zone");
            entity.Property(e => e.TeamAId).HasColumnName("TeamAId");
            entity.Property(e => e.TeamBId).HasColumnName("TeamBId");

            entity.HasOne(d => d.Stage).WithMany(p => p.Matches)
                .HasForeignKey(d => d.StageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Matches_StageId_fkey");

            entity.HasOne(d => d.TeamA).WithMany(p => p.MatchTeamAs)
                .HasForeignKey(d => d.TeamAId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Matches_TeamAId_fkey");

            entity.HasOne(d => d.TeamB).WithMany(p => p.MatchTeamBs)
                .HasForeignKey(d => d.TeamBId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Matches_TeamBId_fkey");

            entity.HasOne(d => d.Tournament).WithMany(p => p.Matches)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("Matches_TournamentId_fkey");
        });

        modelBuilder.Entity<MatchResult>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("MatchResults_pkey");

            entity.HasIndex(e => e.MatchId, "MatchResults_MatchId_key").IsUnique();

            entity.HasOne(d => d.Match).WithOne(p => p.MatchResult)
                .HasForeignKey<MatchResult>(d => d.MatchId)
                .HasConstraintName("MatchResults_MatchId_fkey");

            entity.HasOne(d => d.WinnerTeam).WithMany(p => p.MatchResults)
                .HasForeignKey(d => d.WinnerTeamId)
                .HasConstraintName("MatchResults_WinnerTeamId_fkey");
        });

        modelBuilder.Entity<MatchStage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("MatchStages_pkey");

            entity.HasIndex(e => e.Title, "MatchStages_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Roles_pkey");

            entity.HasIndex(e => e.Title, "Roles_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Teams_pkey");

            entity.HasIndex(e => e.Title, "Teams_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.Captain).WithMany(p => p.Teams)
                .HasForeignKey(d => d.CaptainId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Teams_CaptainId_fkey");

            entity.HasOne(d => d.Discipline).WithMany(p => p.Teams)
                .HasForeignKey(d => d.DisciplineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Teams_DisciplineId_fkey");
        });

        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TeamMembers_pkey");

            entity.HasIndex(e => new { e.TeamId, e.UserId }, "TeamMembers_TeamId_UserId_key").IsUnique();

            entity.HasOne(d => d.Team).WithMany(p => p.TeamMembers)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("TeamMembers_TeamId_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.TeamMembers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("TeamMembers_UserId_fkey");
        });

        modelBuilder.Entity<Tournament>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Tournaments_pkey");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.PrizePool).HasPrecision(12, 2);
            entity.Property(e => e.Title).HasMaxLength(150);

            entity.HasOne(d => d.Discipline).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.DisciplineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Tournaments_DisciplineId_fkey");

            entity.HasOne(d => d.Organizer).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.OrganizerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Tournaments_OrganizerId_fkey");

            entity.HasOne(d => d.Status).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Tournaments_StatusId_fkey");

            entity.HasOne(d => d.System).WithMany(p => p.Tournaments)
                .HasForeignKey(d => d.SystemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Tournaments_SystemId_fkey");
        });

        modelBuilder.Entity<TournamentApplication>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentApplications_pkey");

            entity.HasIndex(e => new { e.TournamentId, e.TeamId }, "TournamentApplications_TournamentId_TeamId_key").IsUnique();

            entity.Property(e => e.AppliedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Status).WithMany(p => p.TournamentApplications)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("TournamentApplications_StatusId_fkey");

            entity.HasOne(d => d.Team).WithMany(p => p.TournamentApplications)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("TournamentApplications_TeamId_fkey");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentApplications)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("TournamentApplications_TournamentId_fkey");
        });

        modelBuilder.Entity<TournamentApplicationStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentApplicationStatusHistory_pkey");

            entity.ToTable("TournamentApplicationStatusHistory");

            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.Application).WithMany(p => p.TournamentApplicationStatusHistories)
                .HasForeignKey(d => d.ApplicationId)
                .HasConstraintName("TournamentApplicationStatusHistory_ApplicationId_fkey");

            entity.HasOne(d => d.ChangedByUser).WithMany(p => p.TournamentApplicationStatusHistories)
                .HasForeignKey(d => d.ChangedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("TournamentApplicationStatusHistory_ChangedByUserId_fkey");

            entity.HasOne(d => d.NewStatus).WithMany(p => p.TournamentApplicationStatusHistoryNewStatuses)
                .HasForeignKey(d => d.NewStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("TournamentApplicationStatusHistory_NewStatusId_fkey");

            entity.HasOne(d => d.OldStatus).WithMany(p => p.TournamentApplicationStatusHistoryOldStatuses)
                .HasForeignKey(d => d.OldStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("TournamentApplicationStatusHistory_OldStatusId_fkey");
        });

        modelBuilder.Entity<TournamentBracket>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentBrackets_pkey");

            entity.Property(e => e.BracketTypeId).HasDefaultValue(1);

            entity.HasOne(d => d.BracketType).WithMany(p => p.TournamentBrackets)
                .HasForeignKey(d => d.BracketTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("TournamentBrackets_BracketTypeId_fkey");

            entity.HasOne(d => d.Match).WithMany(p => p.TournamentBrackets)
                .HasForeignKey(d => d.MatchId)
                .HasConstraintName("TournamentBrackets_MatchId_fkey");

            entity.HasOne(d => d.ParentBracket).WithMany(p => p.InverseParentBracket)
                .HasForeignKey(d => d.ParentBracketId)
                .HasConstraintName("TournamentBrackets_ParentBracketId_fkey");

            entity.HasOne(d => d.Stage).WithMany(p => p.TournamentBrackets)
                .HasForeignKey(d => d.StageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("TournamentBrackets_StageId_fkey");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentBrackets)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("TournamentBrackets_TournamentId_fkey");
        });

        modelBuilder.Entity<TournamentBracketType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentBracketTypes_pkey");

            entity.HasIndex(e => e.Title, "TournamentBracketTypes_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<TournamentParticipant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentParticipants_pkey");

            entity.HasIndex(e => new { e.TournamentId, e.TeamId }, "TournamentParticipants_TournamentId_TeamId_key").IsUnique();

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);

            entity.HasOne(d => d.Team).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("TournamentParticipants_TeamId_fkey");

            entity.HasOne(d => d.Tournament).WithMany(p => p.TournamentParticipants)
                .HasForeignKey(d => d.TournamentId)
                .HasConstraintName("TournamentParticipants_TournamentId_fkey");
        });

        modelBuilder.Entity<TournamentStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentStatuses_pkey");

            entity.HasIndex(e => e.Title, "TournamentStatuses_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<TournamentSystem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TournamentSystems_pkey");

            entity.HasIndex(e => e.Title, "TournamentSystems_Title_key").IsUnique();

            entity.Property(e => e.Title).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.HasIndex(e => e.Email, "Users_Email_key").IsUnique();

            entity.HasIndex(e => e.Login, "Users_Login_key").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.IsBlocked).HasDefaultValue(false);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Login).HasMaxLength(50);
            entity.Property(e => e.Nickname).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Users_RoleId_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

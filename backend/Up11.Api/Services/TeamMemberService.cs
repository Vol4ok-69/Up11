using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.TeamMember;
using Up11.Api.Helpers;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TeamMemberService(DataBaseContext context) : ITeamMemberService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TeamMemberReadDto>> GetByTeamAsync(int teamId)
    {
        return await _context.TeamMembers
            .Include(tm => tm.Team)
            .Include(tm => tm.User)
            .Where(tm => tm.TeamId == teamId)
            .Select(tm => new TeamMemberReadDto
            {
                Id = tm.Id,
                Team = tm.Team.Title,
                User = tm.User.Nickname,
                JoinedAt = tm.JoinedAt
            })
            .ToListAsync();
    }

    public async Task JoinAsync(TeamMemberCreateDto dto, int currentUserId, string role)
    {
        var roleLevel = RoleHierarchy.GetLevel(role);

        if (roleLevel < (int)RoleLevel.Player)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var team = await _context.Teams
            .Include(t => t.TournamentParticipants)
            .FirstOrDefaultAsync(t => t.Id == dto.TeamId)
            ?? throw new KeyNotFoundException("Команда не найдена");

        if (await _context.TeamMembers
            .AnyAsync(tm => tm.TeamId == dto.TeamId && tm.UserId == currentUserId))
            throw new ArgumentException("Вы уже состоите в этой команде");

        var userTeams = await _context.TeamMembers
            .Where(tm => tm.UserId == currentUserId)
            .Select(tm => tm.TeamId)
            .ToListAsync();

        if (userTeams.Any())
        {
            var newTeamTournaments = await _context.TournamentParticipants
                .Where(tp => tp.TeamId == dto.TeamId)
                .Select(tp => tp.TournamentId)
                .ToListAsync();

            var existingTournaments = await _context.TournamentParticipants
                .Where(tp => userTeams.Contains(tp.TeamId))
                .Select(tp => tp.TournamentId)
                .ToListAsync();

            var hasConflict = newTeamTournaments
                .Intersect(existingTournaments)
                .Any();

            if (hasConflict)
                throw new ArgumentException("Нельзя участвовать в двух командах одного турнира");
        }

        var member = new TeamMember
        {
            TeamId = dto.TeamId,
            UserId = currentUserId,
            JoinedAt = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        _context.TeamMembers.Add(member);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(int teamMemberId, int currentUserId, string role)
    {
        var member = await _context.TeamMembers
            .Include(tm => tm.Team)
            .FirstOrDefaultAsync(tm => tm.Id == teamMemberId)
            ?? throw new KeyNotFoundException("Участник не найден");

        var roleLevel = RoleHierarchy.GetLevel(role);

        var isSelf = member.UserId == currentUserId;
        var isCaptain = member.Team.CaptainId == currentUserId;
        var isAdmin = roleLevel >= (int)RoleLevel.Administrator;

        if (!isSelf && !isCaptain && !isAdmin)
            throw new UnauthorizedAccessException("Недостаточно прав");

        if (member.Team.CaptainId == member.UserId)
            throw new ArgumentException("Капитан не может покинуть команду. Сначала нужно переназначить капитана");

        _context.TeamMembers.Remove(member);
        await _context.SaveChangesAsync();
    }
}
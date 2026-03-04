using Up11.Api.DTOs.TeamMember;

namespace Up11.Api.Interfaces;

public interface ITeamMemberService
{
    Task<IEnumerable<TeamMemberReadDto>> GetByTeamAsync(int teamId);
    Task JoinAsync(TeamMemberCreateDto dto, int currentUserId, string role);
    Task RemoveAsync(int teamMemberId, int currentUserId, string role);
    Task AddMemberAsAdminAsync(AdminTeamMemberCreateDto dto, string role);
}
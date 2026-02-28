using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.DTOs.TeamMember;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMembersController(ITeamMemberService service) : ControllerBase
{
    private readonly ITeamMemberService _service = service;

    [Authorize]
    [HttpGet("team/{teamId}")]
    public async Task<IActionResult> GetByTeam(int teamId)
        => Ok(await _service.GetByTeamAsync(teamId));

    [Authorize]
    [HttpPost("join")]
    public async Task<IActionResult> Join(TeamMemberCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        await _service.JoinAsync(dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        await _service.RemoveAsync(id, userId, role);
        return NoContent();
    }
}
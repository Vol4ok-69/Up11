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
    #region Swagger
    [ProducesResponseType(typeof(IEnumerable<TeamMemberReadDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<IEnumerable<TeamMemberReadDto>>> GetByTeam(int teamId)
        => Ok(await _service.GetByTeamAsync(teamId));

    [Authorize]
    [HttpPost("join")]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    #endregion
    public async Task<ActionResult> Join(TeamMemberCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        await _service.JoinAsync(dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpDelete("{id}")]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    #endregion
    public async Task<ActionResult> Remove(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        await _service.RemoveAsync(id, userId, role);
        return NoContent();
    }
}
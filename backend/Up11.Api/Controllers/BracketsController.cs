using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.DTOs.Bracket;
using Up11.Api.DTOs.Swiss;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BracketsController(IBracketService service) : ControllerBase
{
    private readonly IBracketService _service = service;

    [Authorize]
    [HttpPost("{tournamentId}/generate")]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    #endregion
    public async Task<ActionResult> Generate(int tournamentId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.GenerateAsync(tournamentId, userId, role);
        return Ok();
    }

    [Authorize]
    [HttpGet("{tournamentId}")]
    #region Swagger
    [ProducesResponseType(typeof(IEnumerable<TournamentBracketReadDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<IEnumerable<TournamentBracketReadDto>>> GetAll(int tournamentId)
    {
        var tournaments = await _service.GetByTournamentAsync(tournamentId);
        return Ok(tournaments);
    }

    [Authorize]
    [HttpGet("{tournamentId}/tree")]
    #region Swagger
    [ProducesResponseType(typeof(List<BracketNodeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<List<BracketNodeDto>>> GetTree(int tournamentId)
    {
        var tree = await _service.GetBracketTreeAsync(tournamentId);
        return Ok(tree);
    }
    [Authorize]
    [HttpGet("{tournamentId}/swiss/table")]
    #region Swagger
    [ProducesResponseType(typeof(List<SwissTableDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<List<SwissTableDto>>> GetSwissTable(int tournamentId)
    {
        var table = await _service.GetSwissTableAsync(tournamentId);
        return Ok(table);
    }
}
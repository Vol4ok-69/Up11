using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.DTOs.Match;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController(IMatchService service) : ControllerBase
{
    private readonly IMatchService _service = service;

    [Authorize]
    [HttpGet("tournament/{tournamentId}")]
    #region Swagger
    [ProducesResponseType(typeof(IEnumerable<MatchReadDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<IEnumerable<MatchReadDto>>> GetByTournament(int tournamentId)
        => Ok(await _service.GetByTournamentAsync(tournamentId));

    [Authorize]
    [HttpPost]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    #endregion
    public async Task<ActionResult> Create(MatchCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.CreateAsync(dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpPost("{id}/result")]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    #endregion
    public async Task<ActionResult> AddResult(int id, MatchResultCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.AddResultAsync(id, dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpGet("{id}/result")]
    #region Swagger
    [ProducesResponseType(typeof(MatchResultReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    #endregion
    public async Task<ActionResult<MatchResultReadDto>> GetResult(int id)
    {
        return Ok(await _service.GetResultAsync(id));
    }
}
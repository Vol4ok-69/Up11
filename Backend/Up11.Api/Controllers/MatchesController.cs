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
    public async Task<IActionResult> GetByTournament(int tournamentId)
        => Ok(await _service.GetByTournamentAsync(tournamentId));

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(MatchCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.CreateAsync(dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpPost("{id}/result")]
    public async Task<IActionResult> AddResult(int id, MatchResultCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.AddResultAsync(id, dto, userId, role);
        return StatusCode(201);
    }
}
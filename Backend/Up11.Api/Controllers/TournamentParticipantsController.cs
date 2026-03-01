using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.DTOs.TournamentParticipant;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TournamentParticipantsController(
    ITournamentParticipantService service)
    : ControllerBase
{
    private readonly ITournamentParticipantService _service = service;

    [Authorize]
    [HttpGet("tournament/{tournamentId}")]
    public async Task<IActionResult> GetByTournament(int tournamentId)
        => Ok(await _service.GetByTournamentAsync(tournamentId));

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Add(TournamentParticipantCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.AddAsync(dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.RemoveAsync(id, userId, role);
        return NoContent();
    }
}
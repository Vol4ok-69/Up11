using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.DTOs.TournamentApplication;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TournamentApplicationsController(ITournamentApplicationService service) : ControllerBase
{
    private readonly ITournamentApplicationService _service = service;

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(
        TournamentApplicationCreateDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.CreateAsync(dto, userId, role);
        return StatusCode(201);
    }

    [Authorize]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        TournamentApplicationUpdateDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.UpdateStatusAsync(
            id,
            dto.StatusId,
            userId,
            role);

        return NoContent();
    }

    [Authorize]
    [HttpGet("tournament/{tournamentId}")]
    public async Task<IActionResult> GetByTournament(int tournamentId)
        => Ok(await _service.GetByTournamentAsync(tournamentId));

    [Authorize]
    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
        => Ok(await _service.GetHistoryAsync(id));
}
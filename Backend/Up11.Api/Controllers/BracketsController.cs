using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BracketsController(IBracketService service) : ControllerBase
{
    private readonly IBracketService _service = service;

    [Authorize]
    [HttpPost("{tournamentId}/generate")]
    public async Task<IActionResult> Generate(int tournamentId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        await _service.GenerateAsync(tournamentId, userId, role);
        return Ok();
    }
    [Authorize]
    [HttpGet("{tournamentId}")]
    public async Task<IActionResult> GetTree(int tournamentId)
    {
        var tree = await _service.GetBracketTreeAsync(tournamentId);
        return Ok(tree);
    }
    [Authorize]
    [HttpGet("{tournamentId}/swiss/table")]
    public async Task<IActionResult> GetSwissTable(int tournamentId)
    {
        var table = await _service.GetSwissTableAsync(tournamentId);
        return Ok(table);
    }
}
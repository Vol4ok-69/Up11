using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Up11.Api.DTOs.User;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
        => Ok(await _service.GetByIdAsync(id));

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UserUpdateDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    [Authorize]
    [HttpPatch("{id}/change/password")]
    public async Task<IActionResult> ChangePassword(int id, ChangePasswordDto dto)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        await _service.ChangePasswordAsync(id, dto, currentUserId, role);
        return NoContent();
    }

    [Authorize]
    [HttpPatch("{id}/change/email")]
    public async Task<IActionResult> ChangeEmail(int id, ChangeEmailDto dto)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        await _service.ChangeEmailAsync(id, dto, currentUserId, role);
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPatch("{id}/block")]
    public async Task<IActionResult> Block(int id)
    {
        await _service.BlockAsync(id);
        return NoContent();
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPatch("{id}/unblock")]
    public async Task<IActionResult> Unblock(int id)
    {
        await _service.UnblockAsync(id);
        return NoContent();
    }
}
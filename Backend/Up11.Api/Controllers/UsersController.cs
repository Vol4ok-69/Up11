using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Up11.Api.DTOs.User;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    [Authorize(Roles = "Администратор")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
        => Ok(await _service.GetByIdAsync(id));

    [Authorize(Roles = "Администратор")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UserUpdateDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    [Authorize(Roles = "Администратор")]
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
        await _service.ChangePasswordAsync(id, dto);
        return NoContent();
    }

    [Authorize]
    [HttpPatch("{id}/change/email")]
    public async Task<IActionResult> ChangeEmail(int id, ChangeEmailDto dto)
    {
        await _service.ChangeEmailAsync(id, dto);
        return NoContent();
    }
}
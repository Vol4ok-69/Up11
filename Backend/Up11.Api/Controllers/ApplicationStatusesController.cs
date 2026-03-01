using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Up11.Api.DTOs.ApplicationStatus;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationStatusesController(IApplicationStatusService service)
    : ControllerBase
{
    private readonly IApplicationStatusService _service = service;

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
        => Ok(await _service.GetByIdAsync(id));

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create(ApplicationStatusCreateDto dto)
    {
        await _service.CreateAsync(dto);
        return StatusCode(201);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ApplicationStatusUpdateDto dto)
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
}
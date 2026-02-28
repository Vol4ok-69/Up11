using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Up11.Api.DTOs.Discipline;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DisciplinesController(IDisciplineService service) : ControllerBase
{
    private readonly IDisciplineService _service = service;

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
        => Ok(await _service.GetByIdAsync(id));

    [Authorize(Policy = "OrganizerOrHigher")]
    [HttpPost]
    public async Task<IActionResult> Create(DisciplineCreateDto dto)
    {
        await _service.CreateAsync(dto);
        return StatusCode(201);
    }

    [Authorize(Policy = "OrganizerOrHigher")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, DisciplineUpdateDto dto)
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
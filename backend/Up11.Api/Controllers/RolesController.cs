using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Up11.Api.DTOs.Role;
using Up11.Api.Interfaces;

namespace Up11.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController(IRoleService service) : ControllerBase
{
    private readonly IRoleService _service = service;

    [Authorize]
    [HttpGet]
    #region Swagger
    [ProducesResponseType(typeof(IEnumerable<RoleReadDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<IEnumerable<RoleReadDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [Authorize]
    [HttpGet("{id}")]
    #region Swagger
    [ProducesResponseType(typeof(RoleReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    #endregion
    public async Task<ActionResult<RoleReadDto>> Get(int id)
        => Ok(await _service.GetByIdAsync(id));

    [Authorize(Policy = "OrganizerOrHigher")]
    [HttpPost]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    #endregion
    public async Task<ActionResult> Create(RoleCreateDto dto)
    {
        await _service.CreateAsync(dto);
        return StatusCode(201);
    }

    [Authorize(Policy = "OrganizerOrHigher")]
    [HttpPut("{id}")]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    #endregion
    public async Task<ActionResult> Update(int id, RoleUpdateDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    [Authorize(Policy = "OrganizerOrHigher")]
    [HttpDelete("{id}")]
    #region Swagger
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    #endregion
    public async Task<ActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}

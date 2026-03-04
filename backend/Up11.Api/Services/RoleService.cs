using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Role;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class RoleService(DataBaseContext context) : IRoleService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<RoleReadDto>> GetAllAsync()
    {
        return await _context.Roles
            .Select(r => new RoleReadDto
            {
                Id = r.Id,
                Title = r.Title
            })
            .ToListAsync();
    }

    public async Task<RoleReadDto> GetByIdAsync(int id)
    {
        return await _context.Roles
            .Where(r => r.Id == id)
            .Select(r => new RoleReadDto
            {
                Id = r.Id,
                Title = r.Title
            })
            .FirstOrDefaultAsync()
            ?? throw new KeyNotFoundException("Роль не найдена");
    }

    public async Task CreateAsync(RoleCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("Название роли не указано");

        if (await _context.Roles.AnyAsync(r => r.Title == dto.Title))
            throw new ArgumentException("Роль уже существует");

        var role = new Role
        {
            Title = dto.Title
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, RoleUpdateDto dto)
    {
        var role = await _context.Roles.FindAsync(id)
            ?? throw new KeyNotFoundException("Роль не найдена");

        if (dto.Title != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Название роли не может быть пустым");

            role.Title = dto.Title;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var role = await _context.Roles.FindAsync(id)
            ?? throw new KeyNotFoundException("Роль не найдена");

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
    }
}

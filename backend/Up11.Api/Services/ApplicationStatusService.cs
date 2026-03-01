using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.ApplicationStatus;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class ApplicationStatusService(DataBaseContext context)
    : IApplicationStatusService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<ApplicationStatusReadDto>> GetAllAsync()
    {
        return await _context.ApplicationStatuses
            .Select(s => new ApplicationStatusReadDto
            {
                Id = s.Id,
                Title = s.Title
            })
            .ToListAsync();
    }

    public async Task<ApplicationStatusReadDto> GetByIdAsync(int id)
    {
        var status = await _context.ApplicationStatuses
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Статус заявки не найден");

        return new ApplicationStatusReadDto
        {
            Id = status.Id,
            Title = status.Title
        };
    }

    public async Task CreateAsync(ApplicationStatusCreateDto dto)
    {
        if (await _context.ApplicationStatuses.AnyAsync(s => s.Title == dto.Title))
            throw new ArgumentException("Статус уже существует");

        _context.ApplicationStatuses.Add(new ApplicationStatus
        {
            Title = dto.Title
        });

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, ApplicationStatusUpdateDto dto)
    {
        var status = await _context.ApplicationStatuses.FindAsync(id)
            ?? throw new KeyNotFoundException("Статус заявки не найден");

        if (dto.Title != null)
            status.Title = dto.Title;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var status = await _context.ApplicationStatuses.FindAsync(id)
            ?? throw new KeyNotFoundException("Статус заявки не найден");

        _context.ApplicationStatuses.Remove(status);
        await _context.SaveChangesAsync();
    }
}
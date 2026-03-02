using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.TournamentStatus;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TournamentStatusService(DataBaseContext context)
    : ITournamentStatusService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TournamentStatusReadDto>> GetAllAsync()
    {
        return await _context.TournamentStatuses
            .Select(s => new TournamentStatusReadDto
            {
                Id = s.Id,
                Title = s.Title
            })
            .ToListAsync();
    }

    public async Task<TournamentStatusReadDto> GetByIdAsync(int id)
    {
        var status = await _context.TournamentStatuses
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Статус турнира не найден");

        return new TournamentStatusReadDto
        {
            Id = status.Id,
            Title = status.Title
        };
    }

    public async Task CreateAsync(TournamentStatusCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("Название статуса турнира не указано");

        if (await _context.TournamentStatuses.AnyAsync(s => s.Title == dto.Title))
            throw new ArgumentException("Статус уже существует");

        _context.TournamentStatuses.Add(new TournamentStatus
        {
            Title = dto.Title
        });

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, TournamentStatusUpdateDto dto)
    {
        var status = await _context.TournamentStatuses.FindAsync(id)
            ?? throw new KeyNotFoundException("Статус турнира не найден");

        if (dto.Title != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Название статуса турнира не может быть пустым");

            status.Title = dto.Title;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var status = await _context.TournamentStatuses.FindAsync(id)
            ?? throw new KeyNotFoundException("Статус турнира не найден");

        _context.TournamentStatuses.Remove(status);
        await _context.SaveChangesAsync();
    }
}
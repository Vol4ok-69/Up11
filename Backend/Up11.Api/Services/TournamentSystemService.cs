using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.TournamentSystem;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TournamentSystemService(DataBaseContext context)
    : ITournamentSystemService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TournamentSystemReadDto>> GetAllAsync()
    {
        return await _context.TournamentSystems
            .Select(s => new TournamentSystemReadDto
            {
                Id = s.Id,
                Title = s.Title
            })
            .ToListAsync();
    }

    public async Task<TournamentSystemReadDto> GetByIdAsync(int id)
    {
        var system = await _context.TournamentSystems
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Система турнира не найдена");

        return new TournamentSystemReadDto
        {
            Id = system.Id,
            Title = system.Title
        };
    }

    public async Task CreateAsync(TournamentSystemCreateDto dto)
    {
        if (await _context.TournamentSystems.AnyAsync(s => s.Title == dto.Title))
            throw new ArgumentException("Система уже существует");

        _context.TournamentSystems.Add(new TournamentSystem
        {
            Title = dto.Title
        });

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, TournamentSystemUpdateDto dto)
    {
        var system = await _context.TournamentSystems.FindAsync(id)
            ?? throw new KeyNotFoundException("Система турнира не найдена");

        if (dto.Title != null)
            system.Title = dto.Title;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var system = await _context.TournamentSystems.FindAsync(id)
            ?? throw new KeyNotFoundException("Система турнира не найдена");

        _context.TournamentSystems.Remove(system);
        await _context.SaveChangesAsync();
    }
}
using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.TournamentBracketType;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TournamentBracketTypeService(DataBaseContext context)
    : ITournamentBracketTypeService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<TournamentBracketTypeReadDto>> GetAllAsync()
    {
        return await _context.TournamentBracketTypes
            .Select(s => new TournamentBracketTypeReadDto
            {
                Id = s.Id,
                Title = s.Title
            })
            .ToListAsync();
    }

    public async Task<TournamentBracketTypeReadDto> GetByIdAsync(int id)
    {
        var type = await _context.TournamentBracketTypes
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Тип сетки не найден");

        return new TournamentBracketTypeReadDto
        {
            Id = type.Id,
            Title = type.Title
        };
    }

    public async Task CreateAsync(TournamentBracketTypeCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("Название типа сетки не указано");

        if (await _context.TournamentBracketTypes.AnyAsync(s => s.Title == dto.Title))
            throw new ArgumentException("Тип сетки уже существует");

        _context.TournamentBracketTypes.Add(new TournamentBracketType
        {
            Title = dto.Title
        });

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, TournamentBracketTypeUpdateDto dto)
    {
        var type = await _context.TournamentBracketTypes.FindAsync(id)
            ?? throw new KeyNotFoundException("Тип сетки не найден");

        if (dto.Title != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Название типа сетки не может быть пустым");

            type.Title = dto.Title;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var type = await _context.TournamentBracketTypes.FindAsync(id)
            ?? throw new KeyNotFoundException("Тип сетки не найден");

        _context.TournamentBracketTypes.Remove(type);
        await _context.SaveChangesAsync();
    }
}
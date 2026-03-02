using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.MatchStage;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class MatchStageService(DataBaseContext context)
    : IMatchStageService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<MatchStageReadDto>> GetAllAsync()
    {
        return await _context.MatchStages
            .Select(s => new MatchStageReadDto
            {
                Id = s.Id,
                Title = s.Title
            })
            .ToListAsync();
    }

    public async Task<MatchStageReadDto> GetByIdAsync(int id)
    {
        var stage = await _context.MatchStages
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("Стадия не найдена");

        return new MatchStageReadDto
        {
            Id = stage.Id,
            Title = stage.Title
        };
    }

    public async Task CreateAsync(MatchStageCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("Название стадии не указано");

        if (await _context.MatchStages.AnyAsync(s => s.Title == dto.Title))
            throw new ArgumentException("Стадия уже существует");

        _context.MatchStages.Add(new MatchStage
        {
            Title = dto.Title
        });

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, MatchStageUpdateDto dto)
    {
        var stage = await _context.MatchStages.FindAsync(id)
            ?? throw new KeyNotFoundException("Стадия не найдена");

        if (dto.Title != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Название стадии не может быть пустым");

            stage.Title = dto.Title;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var stage = await _context.MatchStages.FindAsync(id)
            ?? throw new KeyNotFoundException("Стадия не найдена");

        _context.MatchStages.Remove(stage);
        await _context.SaveChangesAsync();
    }
}
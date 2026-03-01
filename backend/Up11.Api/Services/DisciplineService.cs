using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Discipline;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class DisciplineService(DataBaseContext context) : IDisciplineService
{
    private readonly DataBaseContext _context = context;

    public async Task<IEnumerable<Discipline>> GetAllAsync()
        => await _context.Disciplines.ToListAsync();

    public async Task<Discipline> GetByIdAsync(int id)
        => await _context.Disciplines.FindAsync(id)
           ?? throw new KeyNotFoundException("Дисциплина не найдена");

    public async Task CreateAsync(DisciplineCreateDto dto)
    {
        if (await _context.Disciplines.AnyAsync(d => d.Title == dto.Title))
            throw new ArgumentException("Дисциплина уже существует");

        var discipline = new Discipline
        {
            Title = dto.Title,
            Description = dto.Description
        };

        _context.Disciplines.Add(discipline);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, DisciplineUpdateDto dto)
    {
        var discipline = await _context.Disciplines.FindAsync(id)
            ?? throw new KeyNotFoundException("Дисциплина не найдена");

        if (dto.Title != null)
            discipline.Title = dto.Title;

        if (dto.Description != null)
            discipline.Description = dto.Description;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var discipline = await _context.Disciplines.FindAsync(id)
            ?? throw new KeyNotFoundException("Дисциплина не найдена");

        _context.Disciplines.Remove(discipline);
        await _context.SaveChangesAsync();
    }
}
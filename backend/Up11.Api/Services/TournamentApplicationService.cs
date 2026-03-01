using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.TournamentApplication;
using Up11.Api.Interfaces;
using Up11.Api.Models;

namespace Up11.Api.Services;

public class TournamentApplicationService(DataBaseContext context)
    : ITournamentApplicationService
{
    private readonly DataBaseContext _context = context;

    public async Task CreateAsync(
        TournamentApplicationCreateDto dto,
        int currentUserId,
        string role)
    {
        var tournament = await _context.Tournaments
            .FirstOrDefaultAsync(t => t.Id == dto.TournamentId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        var statusTitle = await _context.TournamentStatuses
            .Where(s => s.Id == tournament.StatusId)
            .Select(s => s.Title)
            .FirstAsync();

        if (statusTitle is "Завершен" or "Отменен")
            throw new ArgumentException("Нельзя подать заявку на данный турнир");

        var team = await _context.Teams
            .Include(t => t.TeamMembers)
            .FirstOrDefaultAsync(t => t.Id == dto.TeamId)
            ?? throw new KeyNotFoundException("Команда не найдена");

        if (team.DisciplineId != tournament.DisciplineId)
            throw new ArgumentException("Дисциплина не совпадает");

        if (team.TeamMembers.Count < tournament.MinTeamSize)
            throw new ArgumentException("Недостаточно игроков в команде");

        if (role == "Капитан" && team.CaptainId != currentUserId)
            throw new UnauthorizedAccessException("Вы не капитан этой команды");

        var pendingStatusId = await _context.ApplicationStatuses
            .Where(s => s.Title == "На рассмотрении")
            .Select(s => s.Id)
            .FirstAsync();

        var application = new TournamentApplication
        {
            TournamentId = dto.TournamentId,
            TeamId = dto.TeamId,
            StatusId = pendingStatusId
        };

        _context.TournamentApplications.Add(application);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(
    int id,
    int newStatusId,
    int currentUserId,
    string role)
    {
        var application = await _context.TournamentApplications
            .Include(a => a.Tournament)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted)
            ?? throw new KeyNotFoundException("Заявка не найдена");

        if (role != "Администратор" &&
            application.Tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var oldStatusId = application.StatusId;

        if (oldStatusId == newStatusId)
            return;

        var oldStatus = await _context.ApplicationStatuses
            .Where(s => s.Id == oldStatusId)
            .Select(s => s.Title)
            .FirstAsync();

        var newStatus = await _context.ApplicationStatuses
            .Where(s => s.Id == newStatusId)
            .Select(s => s.Title)
            .FirstAsync();

        if (oldStatus is "Отклонена" or "Завершена" or "Отозвана")
            throw new ArgumentException("Нельзя изменить финальный статус");

        if (oldStatus == "Одобрена" && newStatus == "На рассмотрении")
            throw new ArgumentException("Откат статуса запрещён");

        application.StatusId = newStatusId;

        if (newStatus == "Одобрена")
        {
            var exists = await _context.TournamentParticipants
                .AnyAsync(p =>
                    p.TournamentId == application.TournamentId &&
                    p.TeamId == application.TeamId &&
                    !p.IsDeleted);

            if (!exists)
            {
                _context.TournamentParticipants.Add(
                    new TournamentParticipant
                    {
                        TournamentId = application.TournamentId,
                        TeamId = application.TeamId
                    });
            }
        }

        if (newStatus is "Отклонена" or "Отозвана")
        {
            var participant = await _context.TournamentParticipants
                .FirstOrDefaultAsync(p =>
                    p.TournamentId == application.TournamentId &&
                    p.TeamId == application.TeamId &&
                    !p.IsDeleted);

            if (participant != null)
                participant.IsDeleted = true;
        }

        _context.Set<TournamentApplicationStatusHistory>().Add(
            new TournamentApplicationStatusHistory
            {
                ApplicationId = application.Id,
                OldStatusId = oldStatusId,
                NewStatusId = newStatusId,
                ChangedByUserId = currentUserId
            });

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<TournamentApplicationReadDto>>
        GetByTournamentAsync(int tournamentId)
    {
        return await _context.TournamentApplications
            .Where(a => a.TournamentId == tournamentId && !a.IsDeleted)
            .Include(a => a.Team)
            .Include(a => a.Status)
            .Select(a => new TournamentApplicationReadDto
            {
                Id = a.Id,
                Tournament = a.Tournament.Title,
                Team = a.Team.Title,
                Status = a.Status.Title
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TournamentApplicationStatusHistoryDto>> GetHistoryAsync(int applicationId)
    {
        return await _context
            .Set<TournamentApplicationStatusHistory>()
            .Where(h => h.ApplicationId == applicationId)
            .Include(h => h.Application)
            .Include(h => h.Application.Tournament)
            .Include(h => h.Application.Team)
            .Include(h => h.Application)
            .Include(h => h.Application)
            .Join(_context.ApplicationStatuses,
                  h => h.OldStatusId,
                  s => s.Id,
                  (h, oldStatus) => new { h, oldStatus })
            .Join(_context.ApplicationStatuses,
                  temp => temp.h.NewStatusId,
                  s => s.Id,
                  (temp, newStatus) => new { temp.h, temp.oldStatus, newStatus })
            .Join(_context.Users,
                  temp => temp.h.ChangedByUserId,
                  u => u.Id,
                  (temp, user) => new TournamentApplicationStatusHistoryDto
                  {
                      OldStatus = temp.oldStatus.Title,
                      NewStatus = temp.newStatus.Title,
                      ChangedBy = user.Nickname,
                      ChangedAt = temp.h.ChangedAt
                  })
            .OrderBy(h => h.ChangedAt)
            .ToListAsync();
    }
}
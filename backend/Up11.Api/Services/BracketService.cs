using Microsoft.EntityFrameworkCore;
using Up11.Api.DTOs.Bracket;
using Up11.Api.DTOs.Swiss;
using Up11.Api.Interfaces;
using Up11.Api.Models;
namespace Up11.Api.Services;

public class BracketService(DataBaseContext context) : IBracketService
{
    private readonly DataBaseContext _context = context;

    public async Task GenerateAsync(int tournamentId, int currentUserId, string role)
    {
        if (tournamentId <= 0)
            throw new ArgumentException("Идентификатор турнира некорректен");

        var tournament = await _context.Tournaments
            .Include(t => t.TournamentParticipants)
            .Include(t => t.System)
            .FirstOrDefaultAsync(t => t.Id == tournamentId && !t.IsDeleted)
            ?? throw new KeyNotFoundException("Турнир не найден");

        if (role != "Администратор" &&
            tournament.OrganizerId != currentUserId)
            throw new UnauthorizedAccessException("Недостаточно прав");

        var teams = tournament.TournamentParticipants
            .Where(p => !p.IsDeleted)
            .Select(p => p.TeamId)
            .ToList();

        switch (tournament.System.Title.ToLower())
        {
            case "double elimination":
                if (teams.Count != 8)
                    throw new ArgumentException("Double Elimination пока поддерживает 8 команд");
                await GenerateDouble(tournamentId, teams);
                break;

            case "single elimination":
                await GenerateSingle(tournamentId, teams);
                break;

            case "swiss":
                await GenerateSwiss(tournamentId, teams);
                break;

            default:
                throw new ArgumentException("Неизвестная система турнира");
        }
        await _context.SaveChangesAsync();
    }

    private async Task GenerateSingle(int tournamentId, List<int> teams)
    {
        int rounds = (int)Math.Log2(teams.Count);

        var bracketsByRound = new List<List<TournamentBracket>>();

        for (int round = 0; round < rounds; round++)
        {
            int matchesInRound = teams.Count / (int)Math.Pow(2, round + 1);

            var roundBrackets = new List<TournamentBracket>();

            for (int pos = 0; pos < matchesInRound; pos++)
            {
                var bracket = new TournamentBracket
                {
                    TournamentId = tournamentId,
                    StageId = await GetStageId(rounds, round),
                    Position = pos
                };

                _context.TournamentBrackets.Add(bracket);
                roundBrackets.Add(bracket);
            }

            bracketsByRound.Add(roundBrackets);
        }

        await _context.SaveChangesAsync();

        for (int round = 0; round < rounds - 1; round++)
        {
            for (int i = 0; i < bracketsByRound[round].Count; i++)
            {
                var parent = bracketsByRound[round + 1][i / 2];
                var child = bracketsByRound[round][i];

                child.ParentBracketId = parent.Id;
                child.SlotInParent = (i % 2) + 1;
            }
        }

        await _context.SaveChangesAsync();

        var firstRound = bracketsByRound[0];

        for (int i = 0; i < firstRound.Count; i++)
        {
            var match = new Match
            {
                TournamentId = tournamentId,
                TeamAId = teams[i * 2],
                TeamBId = teams[i * 2 + 1],
                MatchDate = DateTime.Now.AddDays(1),
                StageId = firstRound[i].StageId,
                IsFinished = false
            };

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            firstRound[i].MatchId = match.Id;
        }

        await _context.SaveChangesAsync();
    }

    private async Task GenerateDouble(int tournamentId, List<int> teams)
    {
        var shuffled = teams.OrderBy(_ => Guid.NewGuid()).ToList();

        var upperType = await GetBracketType("Upper");
        var lowerType = await GetBracketType("Lower");
        var finalType = await GetBracketType("Final");

        var upperRound1 = new List<TournamentBracket>();

        for (int i = 0; i < 4; i++)
        {
            var bracket = new TournamentBracket
            {
                TournamentId = tournamentId,
                StageId = await GetStage("Четвертьфинал"),
                Position = i,
                BracketTypeId = upperType
            };

            _context.TournamentBrackets.Add(bracket);
            upperRound1.Add(bracket);
        }

        await _context.SaveChangesAsync();

        for (int i = 0; i < 4; i++)
        {
            var match = new Match
            {
                TournamentId = tournamentId,
                TeamAId = shuffled[i * 2],
                TeamBId = shuffled[i * 2 + 1],
                MatchDate = DateTime.Now.AddDays(1),
                StageId = upperRound1[i].StageId
            };

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            upperRound1[i].MatchId = match.Id;
        }

        for (int i = 0; i < 2; i++)
        {
            var lowerBracket = new TournamentBracket
            {
                TournamentId = tournamentId,
                StageId = await GetStage("Групповой этап"),
                Position = i,
                BracketTypeId = lowerType
            };

            _context.TournamentBrackets.Add(lowerBracket);
        }

        var finalBracket = new TournamentBracket
        {
            TournamentId = tournamentId,
            StageId = await GetStage("Финал"),
            Position = 0,
            BracketTypeId = finalType
        };

        _context.TournamentBrackets.Add(finalBracket);
    }

    private async Task GenerateSwiss(int tournamentId, List<int> teams)
    {
        var shuffled = teams.OrderBy(_ => Guid.NewGuid()).ToList();

        for (int i = 0; i < shuffled.Count; i += 2)
        {
            _context.Matches.Add(new Match
            {
                TournamentId = tournamentId,
                TeamAId = shuffled[i],
                TeamBId = shuffled[i + 1],
                StageId = await GetStage("Групповой этап"),
                MatchDate = DateTime.Now.AddDays(1),
                IsFinished = false
            });
        }
    }
    public async Task AdvanceWinnerAsync(int matchId)
    {
        var match = await _context.Matches
            .Include(m => m.MatchResult)
            .FirstOrDefaultAsync(m => m.Id == matchId)
            ?? throw new KeyNotFoundException("Матч не найден");

        var bracket = await _context.TournamentBrackets
            .FirstOrDefaultAsync(b => b.MatchId == matchId);

        if (bracket == null)
            return;

        var winner = match.MatchResult!.WinnerTeamId!.Value;
        var loser = match.TeamAId == winner ? match.TeamBId : match.TeamAId;

        var bracketType = await _context.TournamentBracketTypes
            .Where(b => b.Id == bracket.BracketTypeId)
            .Select(b => b.Title)
            .FirstAsync();

        if (bracketType == "Upper")
        {
            await MoveToUpperOrLower(match.TournamentId, winner, loser);
        }
        else if (bracketType == "Lower")
        {
            await MoveToNextLower(match.TournamentId, winner);
        }
        else if (bracketType == "Final")
        {
            await FinishTournament(match.TournamentId);
        }

        await _context.SaveChangesAsync();
    }
    public async Task GenerateNextSwissRound(int tournamentId)
    {
        var teams = await _context.TournamentParticipants
            .Where(p => p.TournamentId == tournamentId && !p.IsDeleted)
            .Select(p => p.TeamId)
            .ToListAsync();

        var wins = await _context.MatchResults
            .Where(r => r.Match.TournamentId == tournamentId)
            .Where(r => r.WinnerTeamId != null)
            .GroupBy(r => r.WinnerTeamId)
            .Select(g => new
            {
                TeamId = g.Key,
                Wins = g.Count()
            })
            .ToDictionaryAsync(x => x.TeamId!.Value, x => x.Wins);

        var ordered = teams
            .OrderByDescending(t => wins.TryGetValue(t, out int value) ? value : 0)
            .ToList();

        for (int i = 0; i < ordered.Count; i += 2)
        {
            _context.Matches.Add(new Match
            {
                TournamentId = tournamentId,
                TeamAId = ordered[i],
                TeamBId = ordered[i + 1],
                StageId = await GetStage("Групповой этап"),
                MatchDate = DateTime.Now.AddDays(1),
                IsFinished = false
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<BracketNodeDto>> GetBracketTreeAsync(int tournamentId)
    {
        var brackets = await _context.TournamentBrackets
            .Where(b => b.TournamentId == tournamentId)
            .Include(b => b.Match)
                .ThenInclude(m => m.TeamA)
            .Include(b => b.Match)
                .ThenInclude(m => m.TeamB)
            .Include(b => b.Match)
                .ThenInclude(m => m.Stage)
            .Include(b => b.BracketType)
            .Select(b => new TournamentBracketReadDto
            {
                Id = b.Id,
                TournamentId = b.TournamentId,
                StageId = b.StageId,
                Position = b.Position,
                MatchId = b.MatchId,
                ParentBracketId = b.ParentBracketId,
                SlotInParent = b.SlotInParent,
                BracketType = b.BracketType.Title
            })
            .ToListAsync();

        var roots = brackets
            .Where(b => b.ParentBracketId == null)
            .ToList();

        return roots
            .Select(r => BuildNode(r, brackets))
            .ToList();
    }

    private static BracketNodeDto BuildNode(
        TournamentBracketReadDto bracket,
        List<TournamentBracketReadDto> all)
    {
        var node = new BracketNodeDto
        {
            Id = bracket.Id,
            Stage = bracket.StageId.ToString(),
            BracketType = bracket.BracketType,
            TeamA = null,
            TeamB = null,
            IsFinished = false
        };

        var children = all
            .Where(b => b.ParentBracketId == bracket.Id)
            .ToList();

        foreach (var child in children)
            node.Children.Add(BuildNode(child, all));

        return node;
    }

    public async Task<List<SwissTableDto>> GetSwissTableAsync(int tournamentId)
    {
        var participants = await _context.TournamentParticipants
            .Where(p => p.TournamentId == tournamentId && !p.IsDeleted)
            .Select(p => p.Team)
            .ToListAsync();

        var results = await _context.MatchResults
            .Where(r => r.Match.TournamentId == tournamentId)
            .Include(r => r.Match)
            .ToListAsync();

        var table = new List<SwissTableDto>();

        foreach (var team in participants)
        {
            var teamMatches = results
                .Where(r => r.Match.TeamAId == team.Id || r.Match.TeamBId == team.Id)
                .ToList();

            var wins = teamMatches.Count(r => r.WinnerTeamId == team.Id);
            var losses = teamMatches.Count(r => r.WinnerTeamId != null && r.WinnerTeamId != team.Id);

            table.Add(new SwissTableDto
            {
                Team = team.Title,
                Wins = wins,
                Losses = losses,
                Played = teamMatches.Count
            });
        }

        return table
            .OrderByDescending(t => t.Wins)
            .ThenBy(t => t.Losses)
            .ToList();
    }

    private async Task MoveToUpperOrLower(int tournamentId, int winner, int loser)
    {
        var nextUpperMatch = await CreateMatch(tournamentId, "Полуфинал");
        AssignTeam(nextUpperMatch, winner);

        var lowerMatch = await CreateMatch(tournamentId, "Групповой этап");
        AssignTeam(lowerMatch, loser);
    }

    private async Task MoveToNextLower(int tournamentId, int winner)
    {
        var nextLower = await CreateMatch(tournamentId, "Полуфинал");
        AssignTeam(nextLower, winner);
    }

    private async Task<Match> CreateMatch(int tournamentId, string stage)
    {
        var match = new Match
        {
            TournamentId = tournamentId,
            StageId = await GetStage(stage),
            MatchDate = DateTime.Now.AddDays(1),
            IsFinished = false
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        return match;
    }

    private static void AssignTeam(Match match, int teamId)
    {
        if (match.TeamAId == default)
            match.TeamAId = teamId;
        else
            match.TeamBId = teamId;
    }

    private async Task FinishTournament(int tournamentId)
    {
        var finished = await _context.TournamentStatuses
            .Where(s => s.Title == "Завершен")
            .Select(s => s.Id)
            .FirstAsync();

        var tournament = await _context.Tournaments
            .FirstAsync(t => t.Id == tournamentId);

        tournament.StatusId = finished;
    }

    private async Task<int> GetStage(string title)
    {
        return await _context.MatchStages
            .Where(s => s.Title == title)
            .Select(s => s.Id)
            .FirstAsync();
    }

    private async Task<int> GetBracketType(string title)
    {
        return await _context.TournamentBracketTypes
            .Where(b => b.Title == title)
            .Select(b => b.Id)
            .FirstAsync();
    }
    private async Task<int> GetStageId(int totalRounds, int currentRound)
    {
        if (totalRounds == 3) // 8 teams
        {
            if (currentRound == 0) return await GetStage("Четвертьфинал");
            if (currentRound == 1) return await GetStage("Полуфинал");
            return await GetStage("Финал");
        }

        return await GetStage("Групповой этап");
    }
    public async Task<List<TournamentBracketReadDto>> GetByTournamentAsync(int tournamentId)
    {
        if (tournamentId <= 0)
            throw new ArgumentException("Идентификатор турнира некорректен");

        return await _context.TournamentBrackets
            .Where(b => b.TournamentId == tournamentId)
            .Include(b => b.BracketType)
            .Select(b => new TournamentBracketReadDto
            {
                Id = b.Id,
                TournamentId = b.TournamentId,
                StageId = b.StageId,
                Position = b.Position,
                MatchId = b.MatchId,
                ParentBracketId = b.ParentBracketId,
                SlotInParent = b.SlotInParent,
                BracketType = b.BracketType.Title
            })
            .OrderBy(b => b.StageId)
            .ThenBy(b => b.Position)
            .ToListAsync();
    }
}
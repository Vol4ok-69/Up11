namespace Up11.Api.DTOs.TournamentApplication;

public class TournamentApplicationStatusHistoryDto
{
    public string OldStatus { get; set; } = null!;
    public string NewStatus { get; set; } = null!;
    public string ChangedBy { get; set; } = null!;
    public DateTime ChangedAt { get; set; }
}
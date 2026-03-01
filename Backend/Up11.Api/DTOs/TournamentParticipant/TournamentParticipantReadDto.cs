namespace Up11.Api.DTOs.TournamentParticipant;

public class TournamentParticipantReadDto
{
    public int Id { get; set; }
    public string Tournament { get; set; } = null!;
    public string Team { get; set; } = null!;
}
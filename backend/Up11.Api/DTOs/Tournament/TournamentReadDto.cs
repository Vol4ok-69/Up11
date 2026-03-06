public class TournamentReadDto
{
    public int Id { get; set; }

    public string Title { get; set; }

    public int DisciplineId { get; set; }
    public string Discipline { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public decimal PrizePool { get; set; }

    public int MinTeamSize { get; set; }

    public int StatusId { get; set; }
    public string Status { get; set; }
}
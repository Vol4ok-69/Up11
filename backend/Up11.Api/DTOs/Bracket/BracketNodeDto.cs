namespace Up11.Api.DTOs.Bracket;

public class BracketNodeDto
{
    public int Id { get; set; }

    public string Stage { get; set; } = null!;

    public string? BracketType { get; set; }

    public string? TeamA { get; set; }
    public string? TeamB { get; set; }

    public bool IsFinished { get; set; }

    public List<BracketNodeDto> Children { get; set; } = [];
}
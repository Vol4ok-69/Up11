namespace Up11.Api.DTOs.Swiss;

public class SwissTableDto
{
    public string Team { get; set; } = null!;

    public int Wins { get; set; }
    public int Losses { get; set; }
    public int Played { get; set; }
}
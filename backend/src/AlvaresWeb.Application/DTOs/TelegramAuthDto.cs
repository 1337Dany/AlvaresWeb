namespace AlvaresWeb.Application.DTOs;

public class TelegramAuthDto
{
    public long Id { get; set; }
    public string Username { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Hash { get; set; } = null!;
    public long AuthDate { get; set; }
}

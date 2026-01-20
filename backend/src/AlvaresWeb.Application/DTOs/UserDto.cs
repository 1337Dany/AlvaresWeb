namespace AlvaresWeb.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public long TelegramId { get; set; }
    public string? Username { get; set; }
    public string? FullName { get; set; }
}
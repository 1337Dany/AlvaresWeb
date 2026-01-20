namespace AlvaresWeb.Application.DTOs;

public class ChatMessageDto
{
    public string Id { get; set; }
    public string TelegramUserId { get; set; }
    public string Text { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
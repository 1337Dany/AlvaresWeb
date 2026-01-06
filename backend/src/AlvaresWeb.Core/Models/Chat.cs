namespace AlvaresWeb.Core.Models;

public class Chat
{
    public Guid Id { get; set; }
    public long TelegramChatId { get; set; }
    public string? Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<UserChat> UserChats { get; set; } = new List<UserChat>();
}
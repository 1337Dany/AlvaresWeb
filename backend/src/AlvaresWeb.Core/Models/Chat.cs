namespace AlvaresWeb.Core.Models;

public class Chat
{
    public Guid id { get; set; }
    public long telegram_chat_id { get; set; }
    public string? title { get; set; }
    public DateTime created_at { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<UserChat> UserChats { get; set; } = new List<UserChat>();
}
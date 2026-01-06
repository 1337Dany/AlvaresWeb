namespace AlvaresWeb.Core.Models;

public class User
{
    public Guid Id { get; set; }
    public long TelegramId { get; set; }
    public string? Username { get; set; }
    public string FirstName { get; set; } = null!;
    public string? LastName { get; set; }
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    
    public UserRole Role { get; set; } = UserRole.User;

    // Navigation property
    public virtual ICollection<UserChat> UserChats { get; set; } = new List<UserChat>();
    public virtual ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
}
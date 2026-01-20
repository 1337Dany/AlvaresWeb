namespace AlvaresWeb.Core.Models;

public class UserSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string SessionToken { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    
    // Navigation property
    public User User { get; set; } = null!;
}
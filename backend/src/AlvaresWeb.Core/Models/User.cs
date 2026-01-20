namespace AlvaresWeb.Core.Models;

public class User
{
    public Guid id { get; set; }
    public long telegram_id { get; set; }
    public string? username { get; set; }
    public string first_name { get; set; } = null!;
    public string? last_name { get; set; }
    public DateTime registered_at { get; set; } = DateTime.UtcNow;
    
    public UserRole role { get; set; } = UserRole.User;

    // Navigation property
    public virtual ICollection<UserChat> UserChats { get; set; } = new List<UserChat>();
    public virtual ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
}
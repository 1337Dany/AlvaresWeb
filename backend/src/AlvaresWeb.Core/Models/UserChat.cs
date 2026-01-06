namespace AlvaresWeb.Core.Models;

public class UserChat
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public Guid ChatId { get; set; }
    public virtual Chat Chat { get; set; } = null!;
}
using System.ComponentModel.DataAnnotations;

namespace AlvaresWeb.Application.DTOs;

public class UserAuthDto
{
    [Required]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9_]+$")]
    public string Username { get; set; } = null!;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = null!;
}
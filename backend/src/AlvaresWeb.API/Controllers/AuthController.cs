using System.Security.Claims;
using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Application.Services;
using AlvaresWeb.Core.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace AlvarewWeb.API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _users;

    private static readonly long[] AdminTelegramIds =
    {
        123456789,
        987654321
    };

    public AuthController(IUserRepository users)
    {
        _users = users;
    }

    [HttpPost("telegram")]
    public async Task<IActionResult> TelegramLogin([FromBody] TelegramAuthDto dto)
    {
        if (!TelegramHashValidator.IsValid(dto))
            return Unauthorized("Invalid Telegram hash");

        var user = await _users.GetByTelegramId(dto.Id);

        if (user == null)
        {
            user = new User
            {
                telegram_id = dto.Id,
                username = dto.Username,
                first_name = dto.FirstName,
                last_name = dto.LastName,
                role = UserRole.User
            };

            if (AdminTelegramIds.Contains(dto.Id))
                user.role = UserRole.Admin;

            await _users.Create(user);
        }
        else
        {
            if (AdminTelegramIds.Contains(dto.Id) && user.role != UserRole.Admin)
            {
                user.role = UserRole.Admin;
                await _users.Update(user);
            }
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
            new Claim(ClaimTypes.Role, user.role.ToString())
        };

        var identity = new ClaimsIdentity(claims, "TelegramCookies");
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync("TelegramCookies", principal);

        return Ok(new
        {
            user.id,
            Username = user.username,
            Role = user.role.ToString()
        });
    }
}

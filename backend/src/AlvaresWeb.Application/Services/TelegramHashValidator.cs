using System.Security.Cryptography;
using System.Text;
using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Services.Interfaces;

namespace AlvaresWeb.Application.Services;

public static class TelegramHashValidator
{
    public static bool IsValid(TelegramAuthDto dto)
    {
        var botToken = Environment.GetEnvironmentVariable("TELEGRAM_BOT_TOKEN");

        if (string.IsNullOrEmpty(botToken))
            throw new Exception("TELEGRAM_BOT_TOKEN is not set");

        var data = new SortedDictionary<string, string>
        {
            ["auth_date"] = dto.AuthDate.ToString(),
            ["first_name"] = dto.FirstName,
            ["id"] = dto.Id.ToString()
        };

        if (!string.IsNullOrEmpty(dto.Username))
            data["username"] = dto.Username;

        var dataCheckString = string.Join(
            "\n",
            data.Select(kvp => $"{kvp.Key}={kvp.Value}")
        );

        using var sha256 = SHA256.Create();
        var secretKey = sha256.ComputeHash(Encoding.UTF8.GetBytes(botToken));

        using var hmac = new HMACSHA256(secretKey);
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(dataCheckString));
        var computedHash = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

        return computedHash == dto.Hash;
    }
}
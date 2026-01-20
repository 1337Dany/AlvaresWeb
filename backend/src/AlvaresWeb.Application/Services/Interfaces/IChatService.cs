using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Core.Models;

namespace AlvaresWeb.Application.Services.Interfaces;

public interface IChatService
{
    Task<IEnumerable<ChatDto>> GetAllChatsAsync();
}
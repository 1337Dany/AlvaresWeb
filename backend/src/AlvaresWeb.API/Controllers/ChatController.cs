using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlvarewWeb.API.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatController
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet]
    public async Task<IEnumerable<ChatDto>> GetAllMessages()
    {
        return await _chatService.GetAllChatsAsync();
    }
}
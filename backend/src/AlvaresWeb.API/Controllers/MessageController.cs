using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlvarewWeb.API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class MessageController
{
    private readonly IMessageService _messageService;

    public MessageController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet]
    public async Task<IEnumerable<MessageDto>> GetAllMessages()
    {
        return await _messageService.GetAllMessages();
    }

    [HttpGet("chats/{chatId}")]
    public async Task<IEnumerable<ChatMessageDto>> GetAllMessagesByChatId(string chatId)
    {
        return await _messageService.GetAllMessagesByChatId(chatId);
    }
}
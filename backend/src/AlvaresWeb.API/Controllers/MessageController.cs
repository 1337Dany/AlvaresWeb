using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Services.Interfaces;
using AlvaresWeb.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AlvarewWeb.API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class MessageController : ControllerBase
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

    [HttpDelete("chats/{chatId}/messages/{messageId}")]
    public async Task<IActionResult> DeleteMessage(string chatId, string messageId)
    {
        var deleted = await _messageService.DeleteMessageAsync(chatId, messageId);
        return deleted ? Ok() : BadRequest();
    }

    [HttpPut("chats/{chatId}/messages/{messageId}")]
    public async Task<IActionResult> UpdateMessage(string chatId, string messageId, [FromBody] string newText)
    {
        var updated = await _messageService.UpdateMessageAsync(chatId, messageId, newText);
        return updated ? Ok() : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] ChatMessageDto dto)
    {
        var newMessage = new MongoMessage
        {
            TelegramChatId = dto.ChatId,
            TelegramUserId = dto.TelegramUserId,
            Text = dto.Text,
            CreatedAt = DateTime.UtcNow
        };

        await _messageService.CreateMessageAsync(newMessage);
        return Ok(newMessage);
    }
}
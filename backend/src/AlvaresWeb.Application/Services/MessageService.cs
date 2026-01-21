using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Application.Services.Interfaces;

namespace AlvaresWeb.Application.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;

    public MessageService(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public Task<IEnumerable<MessageDto>> GetAllMessages()
    {
        return _messageRepository.GetAllMessages();
    }

    public async Task<IEnumerable<ChatMessageDto>> GetAllMessagesByChatId(string chatId)
    {
        var messages = await _messageRepository.GetAllMessagesByChatId(chatId);
        return messages.Select(u => new ChatMessageDto()
        {
            Id = u.Id,
            TelegramUserId = u.TelegramUserId,
            Text = u.Text,
            CreatedAt = u.CreatedAt,
        });
    }

    public async Task<bool> DeleteMessageAsync(string chatId, string messageId)
    {
        return await _messageRepository.DeleteMessageAsync(chatId, messageId);
    }

    public async Task<bool> UpdateMessageAsync(string chatId, string messageId, string newText)
    {
        return await _messageRepository.UpdateMessageAsync(chatId, messageId, newText);
    }
}
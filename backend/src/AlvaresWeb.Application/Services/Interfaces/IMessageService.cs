using AlvaresWeb.Application.DTOs;

namespace AlvaresWeb.Application.Services.Interfaces;

public interface IMessageService
{
    Task<IEnumerable<MessageDto>> GetAllMessages();
    Task<IEnumerable<ChatMessageDto>> GetAllMessagesByChatId(string chatId);
    Task<bool> DeleteMessageAsync(string chatId, string messageId);
    Task<bool> UpdateMessageAsync(string chatId, string messageId, string newText);
}
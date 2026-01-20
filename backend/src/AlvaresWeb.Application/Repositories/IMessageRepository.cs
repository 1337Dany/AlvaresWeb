using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Core.Models;

namespace AlvaresWeb.Application.Repositories;

public interface IMessageRepository
{
    Task<IEnumerable<MessageDto>> GetAllMessages();
    Task<IEnumerable<MongoMessage>> GetAllMessagesByChatId(string chatId);
    Task<bool> DeleteMessageAsync(string chatId, string messageId);
}
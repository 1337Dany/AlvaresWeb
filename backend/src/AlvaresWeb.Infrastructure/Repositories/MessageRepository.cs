using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Core.Models;
using AlvaresWeb.Infrastructure.Persistence;
using MongoDB.Driver;

namespace AlvaresWeb.Infrastructure.Repositories;

public class MessageRepository(NoSqlDriver context) : IMessageRepository
{
    public async Task<IEnumerable<MessageDto>> GetAllMessages()
    {
        var messages = await context.Messages
            .Find(_ => true)
            .ToListAsync();

        return messages.Select(m => new MessageDto
        {
            Text = m.Text,
        });
    }

    public async Task<IEnumerable<MongoMessage>> GetAllMessagesByChatId(string chatId)
    {
        var filter = Builders<MongoMessage>.Filter.Eq(m => m.TelegramChatId, chatId);
        return await context.Messages
            .Find(filter)
            .SortByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}
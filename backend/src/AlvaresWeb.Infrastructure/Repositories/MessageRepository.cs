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

    public async Task<bool> DeleteMessageAsync(string chatId, string messageId)
    {
        var filter = Builders<MongoMessage>.Filter.And(
            Builders<MongoMessage>.Filter.Eq(m => m.TelegramChatId, chatId),
            Builders<MongoMessage>.Filter.Eq(m => m.Id, messageId)
        );
        var result = await context.Messages.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }

    public async Task<bool> UpdateMessageAsync(string chatId, string messageId, string newText)
    {
        var filter = Builders<MongoMessage>.Filter.And(
            Builders<MongoMessage>.Filter.Eq(m => m.TelegramChatId, chatId),
            Builders<MongoMessage>.Filter.Eq(m => m.Id, messageId)
        );

        var update = Builders<MongoMessage>.Update.Set(m => m.Text, newText);

        var result = await context.Messages.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }
}
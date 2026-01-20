using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
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
}
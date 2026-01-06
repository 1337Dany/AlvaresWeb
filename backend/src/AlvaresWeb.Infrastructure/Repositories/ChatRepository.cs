using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Core.Models;
using AlvaresWeb.Infrastructure.Persistence;

namespace AlvaresWeb.Infrastructure.Repositories;

public class ChatRepository(NoSqlDriver mongo ) : IChatRepository
{
    public async Task AddMessageToHistoryAsync(MongoMessage message)
    {
        await mongo.Messages.InsertOneAsync(message);
    }
}
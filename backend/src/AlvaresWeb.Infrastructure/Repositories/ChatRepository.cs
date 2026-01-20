using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Core.Models;
using AlvaresWeb.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AlvaresWeb.Infrastructure.Repositories;

public class ChatRepository(SqlContext context ) : IChatRepository
{
    public async Task AddMessageToHistoryAsync(MongoMessage message)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Chat>> GetAllChatsAsync()
    {
        return await context.Chats.ToListAsync();
    }
}
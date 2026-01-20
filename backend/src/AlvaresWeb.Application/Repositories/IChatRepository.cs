using AlvaresWeb.Core.Models;

namespace AlvaresWeb.Application.Repositories;

public interface IChatRepository
{
    Task AddMessageToHistoryAsync(MongoMessage message);
}
using AlvaresWeb.Core.Models;

namespace AlvaresWeb.Application.Repositories;

public interface IUserRepository
{
    Task<User?> GetByTelegramId(long telegramId);
    Task Create(User user);
    Task Update(User user);
    Task<int> GetCountAsync();

    Task<IEnumerable<User>> GetUsers();
}
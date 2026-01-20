using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Core.Models;
using AlvaresWeb.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AlvaresWeb.Infrastructure.Repositories;

public class UserRepository(SqlContext context) : IUserRepository
{
    public async Task<User?> GetByTelegramId(long telegramId)
    {
        return await context.Users
            .FirstOrDefaultAsync(u => u.telegram_id == telegramId);
    }

    public async Task Create(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task Update(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task<int> GetCountAsync()
    {
        return await context.Users.CountAsync();
    }

    public async Task<IEnumerable<User>> GetUsers()
    {
        return await context.Users.ToListAsync();
    }
}
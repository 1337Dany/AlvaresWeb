using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AlvaresWeb.Infrastructure.Repositories;

public class UserRepository(SqlContext context) : IUserRepository
{
    public async Task<int> GetCountAsync()
    {
        return await context.Users.CountAsync();
    }
}
using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Application.Services.Interfaces;

namespace AlvaresWeb.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        var users = await _userRepository.GetUsers();
        return users.Select(u => new UserDto
        {
            Id = u.id,
            TelegramId = u.telegram_id,
            Username = u.username,
            FullName = $"{u.first_name} {u.last_name}".Trim()
        });
    }
}
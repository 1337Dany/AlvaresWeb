using AlvaresWeb.Application.DTOs;

namespace AlvaresWeb.Application.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetUsersAsync();
}
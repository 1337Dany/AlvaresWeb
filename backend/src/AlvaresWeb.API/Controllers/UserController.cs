using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlvarewWeb.API.Controllers;

[ApiController]
[Route("/api/userchat")]
public class UserController
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    public async Task<IEnumerable<UserDto>> GetAll()
    {
        return await _userService.GetUsersAsync();
    }
}
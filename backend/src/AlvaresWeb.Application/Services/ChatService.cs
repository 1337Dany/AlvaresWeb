using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Application.Services.Interfaces;

namespace AlvaresWeb.Application.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;

    public ChatService(IChatRepository chatRepository)
    {
        _chatRepository = chatRepository;
    }


    public async Task<IEnumerable<ChatDto>> GetAllChatsAsync()
    {
        var chats = await _chatRepository.GetAllChatsAsync();
        return chats.Select(u => new ChatDto()
        {
            Id = u.id,
            Title = u.title,
        });
    }
}
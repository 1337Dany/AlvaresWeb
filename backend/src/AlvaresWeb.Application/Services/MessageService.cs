using AlvaresWeb.Application.DTOs;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Application.Services.Interfaces;

namespace AlvaresWeb.Application.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;

    public MessageService(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public Task<IEnumerable<MessageDto>> GetAllMessages()
    {
        return _messageRepository.GetAllMessages();
    }
}
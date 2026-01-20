using AlvaresWeb.Application.DTOs;

namespace AlvaresWeb.Application.Repositories;

public interface IMessageRepository
{
    Task<IEnumerable<MessageDto>> GetAllMessages();
}
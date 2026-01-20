using AlvaresWeb.Application.DTOs;

namespace AlvaresWeb.Application.Services.Interfaces;

public interface IMessageService
{
    Task<IEnumerable<MessageDto>> GetAllMessages();
}
namespace AlvaresWeb.Application.Repositories;

public interface IUserRepository
{
    Task<int> GetCountAsync();
}
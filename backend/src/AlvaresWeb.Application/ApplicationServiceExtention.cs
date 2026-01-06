using Microsoft.Extensions.DependencyInjection;
using AlvaresWeb.Application.Services;
using AlvaresWeb.Application.Services.Interfaces;

namespace AlvaresWeb.Application;

public static class ApplicationServicesExtension
{
    public static void RegisterApplicationServices(this IServiceCollection app)
    {
        app.AddScoped<IUserService, UserService>();
        app.AddScoped<IChatService, ChatService>();
        app.AddScoped<IMessageService, MessageService>();
        
        
    }
}
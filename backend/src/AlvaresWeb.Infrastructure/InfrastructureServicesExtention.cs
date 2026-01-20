using Microsoft.Extensions.DependencyInjection;
using AlvaresWeb.Infrastructure.Repositories;
using AlvaresWeb.Application.Repositories;
using AlvaresWeb.Infrastructure.Persistence;
using MongoDB.Driver;

namespace AlvaresWeb.Infrastructure;

public static class InfrastructureServicesExtension
{
    public static void RegisterInfraServices(this IServiceCollection app)
    {
        app.AddScoped<IUserRepository, UserRepository>();
        app.AddScoped<IChatRepository, ChatRepository>();
        app.AddScoped<IMessageRepository, MessageRepository>();
        
        app.AddAuthentication("TelegramCookies")
            .AddCookie("TelegramCookies", options => 
            {
                options.Cookie.Name = "Alvares_Session";
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                
                options.Cookie.HttpOnly = true; 
                options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
                options.LoginPath = "/auth/login";
            });
        
        app.AddSingleton<NoSqlDriver>();
        
        app.AddScoped(sp => 
        {
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase("alv_mongo");
        });
        
        app.AddDbContext<SqlContext>();
    }
}
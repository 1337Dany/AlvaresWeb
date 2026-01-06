using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// builder.Services.RegisterInfrastructure(builder.Configuration);
// builder.Services.RegisterApplication();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication("TelegramCookies")
    .AddCookie("TelegramCookies", options => {
        options.Cookie.Name = "Alvares_Session";
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
    });
// Регистрация MongoDB клиента
builder.Services.AddSingleton<IMongoClient>(sp => 
    new MongoClient(builder.Configuration.GetConnectionString("MongoConnection")));

// Регистрация конкретной базы данных
builder.Services.AddScoped(sp => 
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("botadmin");
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
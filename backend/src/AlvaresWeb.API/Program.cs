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
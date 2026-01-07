using System.Security.Claims;
using AlvaresWeb.Core.Models;
using AlvaresWeb.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatsController : ControllerBase
{
    private readonly SqlContext _sqlContext;
    private readonly IMongoCollection<MongoMessage> _mongoMessages;

    public ChatsController(SqlContext sqlContext, IMongoDatabase mongoDatabase)
    {
        _sqlContext = sqlContext;
        _mongoMessages = mongoDatabase.GetCollection<MongoMessage>("messages");
    }

    [HttpGet]
    public async Task<IActionResult> GetChats([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var total = await _sqlContext.Chats.CountAsync();
        var chats = await _sqlContext.Chats
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new {
                c.Id,
                c.Title,
                c.TelegramChatId,
                MembersCount = _sqlContext.UserChats.Count(uc => uc.ChatId == c.Id)
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = chats });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetChatDetails(Guid id)
    {
        var chat = await _sqlContext.Chats.FindAsync(id);
        if (chat == null) return NotFound();

        var messages = await _mongoMessages
            .Find(Builders<MongoMessage>.Filter.Eq(m => m.TelegramChatId, chat.TelegramChatId))
            .SortByDescending(m => m.CreatedAt)
            .Limit(50)
            .ToListAsync();

        return Ok(new { chat, messages });
    }
}
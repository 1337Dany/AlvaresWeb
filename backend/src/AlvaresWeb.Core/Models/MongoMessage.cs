using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AlvaresWeb.Core.Models;

public class MongoMessage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("chatId")]
    public long TelegramChatId { get; set; }

    [BsonElement("telegramUserId")]
    public long TelegramUserId { get; set; }

    [BsonElement("text")]
    public string Text { get; set; } = null!;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AlvaresWeb.Core.Models;

[BsonIgnoreExtraElements]
public class MongoMessage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("chatId")] public string TelegramChatId { get; set; }

    [BsonElement("telegramUserId")] public string TelegramUserId { get; set; }

    [BsonElement("text")] public string Text { get; set; } = null!;

    [BsonElement("createdAt")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
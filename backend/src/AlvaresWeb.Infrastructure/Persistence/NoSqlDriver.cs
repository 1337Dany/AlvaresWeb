using AlvaresWeb.Core.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace AlvaresWeb.Infrastructure.Persistence;

public class AlvaresMongoContext
{
    private readonly IMongoDatabase _database;

    public AlvaresMongoContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoConnection");
        var client = new MongoClient(connectionString);
        
        _database = client.GetDatabase("alv_mongo");
    }

    public IMongoCollection<MongoMessage> Messages => 
        _database.GetCollection<MongoMessage>("messages");
}
using EncryptionExchanger.Db;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EncryptionExchanger.Controllers
{
    [ApiController]
    [Route("keys")]
    public class KeyVaultController : ControllerBase
    {
        protected readonly IMongoCollection<EncryptionModel> _collection;
        public KeyVaultController(IMongoDBSettings settings)
        {
            _collection = new MongoClient(settings.ConnectionString)
                .GetDatabase(settings.DatabaseName)
                .GetCollection<EncryptionModel>(settings.CollectionName);
        }

        [HttpGet("getEncKey")]
        public async Task<ActionResult<EncryptionModel>> GetKey(string userTo, string userFrom, string chatId)
        {
            var filter1 = Builders<EncryptionModel>.Filter.Eq(m => m.UserFrom, userFrom);
            var filter2 = Builders<EncryptionModel>.Filter.Eq(m => m.UserTo, userTo);
            var filter3 = Builders<EncryptionModel>.Filter.Eq(m => m.ChatId, chatId);
            var filterAgg = Builders<EncryptionModel>.Filter.And(filter1, filter2, filter3);
            var fake = await _collection.Find(_ => true).ToListAsync();
            var key = await _collection.Find(filter1 & filter2 & filter3).FirstAsync();
            return key;
        }

        [HttpPost("setEncKey")]
        public async Task<IActionResult> SetKey(EncryptionModel model)
        {
            model._id = BsonObjectId.GenerateNewId().ToString();
            await _collection.InsertOneAsync(model);
            return StatusCode(200);
        }
    }
}
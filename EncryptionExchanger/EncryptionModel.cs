using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EncryptionExchanger
{
    public class EncryptionModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string UserFrom { get; set; }
        public string UserTo { get; set; }
        public string ChatId { get; set; }
        public string PublicKey { get; set; }
    }
}
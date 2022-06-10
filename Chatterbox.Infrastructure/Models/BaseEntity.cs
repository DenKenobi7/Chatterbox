using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chatterbox.Infrastructure.Models
{
    public class BaseEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime? DateCreated { get; set; }
        public bool IsDeleted { get; set; }
    }
}

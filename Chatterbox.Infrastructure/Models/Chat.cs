using Chatterbox.Infrastructure.Attributes;
using Chatterbox.Infrastructure.Models.Identity;

namespace Chatterbox.Infrastructure.Models
{
    [BsonCollection("Chats")]
    public class Chat : BaseEntity
    {
        public List<ApplicationUser> Members { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
    }
}

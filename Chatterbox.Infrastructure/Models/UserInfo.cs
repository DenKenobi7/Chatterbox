using Chatterbox.Infrastructure.Attributes;

namespace Chatterbox.Infrastructure.Models
{
    [BsonCollection("UserInfos")]
    public class UserInfo : BaseEntity
    {
        public string FirstName { get; set; } = null!;
        public string SecondName { get; set; } = null!;
    }
}

using Chatterbox.Infrastructure.Attributes;

namespace Chatterbox.Infrastructure.Models
{
    [BsonCollection("Messages")]
    public class Message : BaseEntity
    {
        public enum MessageStatus
        {
            Sent,
            Delievered,
            Read,
            Cancelled
        }

        public string Text { get; set; } = string.Empty;

        public MessageStatus Status { get; set; } = MessageStatus.Sent;

        public DateTime? DelieveredAt { get; set; } = null;

        public string SenderId { get; set; } = null!;

        public bool IsSelfEncrypted { get; set; }
    }
}
namespace Chatterbox.Infrastructure.Dtos
{
    public class MessageDto
    {
        public string Id { get; set; }
        public string SenderId { get; set; }
        public string Status { get; set; }
        public string Text { get; set; }
        public string IsSelfEncrypted { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}

namespace Chatterbox.Infrastructure.Dtos
{
    public class ChatDetailsDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string CompanionId { get; set; }
        public IEnumerable<MessageDto> Messages { get; set; }
    }
}

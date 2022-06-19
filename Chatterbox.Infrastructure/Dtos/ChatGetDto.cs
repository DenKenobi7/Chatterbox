namespace Chatterbox.Infrastructure.Dtos
{
    public class ChatGetDto
    {
        public string Id { get; set; }
        public DateTime? LastUsed { get; set; }
        public string UserName { get; set; }
        public string CompanionId { get; set; }
    }
}

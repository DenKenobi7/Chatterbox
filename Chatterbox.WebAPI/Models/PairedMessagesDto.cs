using Chatterbox.Infrastructure.Models;

namespace Chatterbox.WebAPI.Models
{
    public class PairedMessagesDto
    {
        public Message MessageSelfEncr { get; set; }
        public Message MessageCompEncr { get; set; }
        public string ChatId { get; set; }
    }
}

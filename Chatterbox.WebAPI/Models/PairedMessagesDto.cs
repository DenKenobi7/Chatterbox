using Chatterbox.Infrastructure.Dtos;
using Chatterbox.Infrastructure.Models;

namespace Chatterbox.WebAPI.Models
{
    public class PairedMessagesDto
    {
        public MessageDto MessageSelfEncr { get; set; }
        public MessageDto MessageCompEncr { get; set; }
        public string ChatId { get; set; }
    }
}

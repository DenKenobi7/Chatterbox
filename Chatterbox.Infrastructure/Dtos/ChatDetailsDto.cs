using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chatterbox.Infrastructure.Dtos
{
    public class ChatDetailsDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string CompanionId { get; set; }
        public IEnumerable<MessageGetDto> Messages { get; set; }
    }
}

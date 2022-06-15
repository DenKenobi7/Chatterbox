using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chatterbox.Infrastructure.Models
{
    public class Chat : BaseEntity
    {
        public IList<string?> Members { get; set; }
        public IList<Message> Messages { get; set; }
    }
}

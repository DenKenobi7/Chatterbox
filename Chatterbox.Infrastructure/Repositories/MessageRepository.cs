using Chatterbox.Infrastructure.DBConnection;
using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Models;
using Chatterbox.Infrastructure.Shared.Providers;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chatterbox.Infrastructure.Repositories
{
    public class MessageRepository : BaseMongoRepository<Message>, IMessageRepository
    {
        public MessageRepository(IMongoDBSettings settings, IDateTimeProvider provider) : base(settings, provider)
        { }
        public async Task<IList<Message>> GetChatMessagesAsync(string senderId, string recipientId)
        {            
            return await _collection.Find(x => x.SenderId == senderId &&
                                                    x.RecipientId == recipientId)
                                    .ToListAsync();
        }
    }
}

using Chatterbox.Infrastructure.Interfaces.Repositories;
using Chatterbox.Infrastructure.Models;

namespace Chatterbox.Infrastructure.Interfaces.Interfaces
{
    public interface IMessageRepository : IDeletableRepository<Message>, IAddableRepository<Message>
    {
        Task<IList<Message>> GetChatMessagesAsync(string senderId, string recipientId);
    }
}

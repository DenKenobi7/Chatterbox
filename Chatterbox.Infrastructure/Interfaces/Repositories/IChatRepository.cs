using Chatterbox.Infrastructure.Dtos;
using Chatterbox.Infrastructure.Interfaces.Repositories;
using Chatterbox.Infrastructure.Models;
using Chatterbox.Infrastructure.Models.Identity;

namespace Chatterbox.Infrastructure.Interfaces.Interfaces
{
    public interface IChatRepository : IDeletableRepository<Chat>, IAddableRepository<Chat>
    {
        Task<ChatDetailsDto> GetChatWithMessagesAsync(string userId, string chatId);
        Task<Message> WriteMessageAsync(Message selfEncrypted, Message conpanionEncrypted, string chatId);
        Task<IList<ChatGetDto>> GetChatsAsync(string userId);
        Task<ChatGetDto> CreateChatAsync(ApplicationUser user1, ApplicationUser user2);
    }
}

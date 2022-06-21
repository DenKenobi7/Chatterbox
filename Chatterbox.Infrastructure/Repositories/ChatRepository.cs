using Chatterbox.Infrastructure.DBConnection;
using Chatterbox.Infrastructure.Dtos;
using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Models;
using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Shared.Providers;
using MongoDB.Driver;

namespace Chatterbox.Infrastructure.Repositories
{
    public class ChatRepository : BaseMongoRepository<Chat>, IChatRepository
    {
        public ChatRepository(IMongoDBSettings settings, IDateTimeProvider provider) : base(settings, provider)
        { }
        public async Task<ChatDetailsDto> GetChatWithMessagesAsync(string userId, string chatId)
        {
            var filter1 = Builders<Chat>.Filter.Eq(doc => doc.Id, chatId);

            var projection = Builders<Chat>.Projection;
            var messages = await _collection.Find(filter1)
                .Project(projection.Expression(m => new
                {
                    CompanionId = m.Members.Select(u => u.Id.ToString()).First(id => id != userId),

                    Messages = m.Messages.Where(m => m.IsSelfEncrypted && m.SenderId == userId ||
                                                       !m.IsSelfEncrypted && m.SenderId != userId)
                                         .ToList()
                }
                ))
                .FirstAsync();
            var chat = new ChatDetailsDto
            {
                Id = chatId,
                UserId = userId,
                CompanionId = messages.CompanionId,
                Messages = messages.Messages.Select(m => new MessageDto
                {
                    Id = m.Id,
                    Text = m.Text,
                    Status = m.Status.ToString(),
                    DateCreated = m.DateCreated,
                    SenderId = m.SenderId
                }).OrderBy(m => m.DateCreated).ToList(),
            };
            return chat;
        }

        public async Task<Message> WriteMessageAsync(Message selfEncrypted, Message conpanionEncrypted, string chatId)
        {
            var filter1 = Builders<Chat>.Filter.Eq(doc => doc.Id, chatId);
            var chat = await _collection.Find(filter1).FirstAsync();
            chat.Messages.Add(selfEncrypted);
            chat.Messages.Add(conpanionEncrypted);
            await _collection.ReplaceOneAsync(d => d.Id == chatId, chat, new ReplaceOptions { IsUpsert = true });
            return selfEncrypted;
        }
        public async Task<IList<ChatGetDto>> GetChatsAsync(string userId)
        {
            var id = new Guid(userId);
            //var filter1 = Builders<Chat>.Filter.Eq(doc => doc.Id, chatId);
            var filter2 = Builders<Chat>.Filter.ElemMatch(chat => chat.Members, it => it.Id == id);
            var result = await _collection
                                    .Find(filter2)
                                    .Project(Builders<Chat>.Projection
                                        .Expression(ch => new ChatGetDto
                                        {
                                            Id = ch.Id,
                                            UserName = ch.Members.Where(m => m.Id != id).Select(m => m.UserName).First(),
                                            CompanionId = ch.Members.Where(m => m.Id != id).Select(m => m.Id.ToString()).First(),
                                            LastUsed = ch.Messages.OrderByDescending(m => m.DelieveredAt).Select(m => m.DelieveredAt).FirstOrDefault() ?? ch.DateCreated
                                        }))
                                    .ToListAsync();
            return result;
        }

        public async Task<ChatGetDto> CreateChatAsync(ApplicationUser user1, ApplicationUser user2, string chatId)
        {
            var chat = new Chat
            {
                Id = chatId,
                Members = new List<ApplicationUser> { user1, user2 },
                DateCreated = _dateTimeProvider.GetCurrentDateTime()
            };
            await _collection.InsertOneAsync(chat);
            return new ChatGetDto
            {
                Id = chat.Id,
                LastUsed = chat.DateCreated,
                UserName = user1.UserName,
                CompanionId = user1.Id.ToString()
            };
        }
    }
}

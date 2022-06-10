using Chatterbox.Infrastructure.Interfaces.Repositories;
using Chatterbox.Infrastructure.Models;

namespace Chatterbox.Infrastructure.Interfaces.Interfaces
{
    public interface IUserInfoRepository : IDeletableRepository<UserInfo>, IAddableRepository<UserInfo>
    {
        Task<IList<UserInfo>> GetAll();
    }
}

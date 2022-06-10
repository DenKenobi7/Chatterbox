using Chatterbox.Infrastructure.Interfaces;
using Chatterbox.Infrastructure.Interfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chatterbox.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        public IMessageRepository MessageRepository { get; }
        public IUserInfoRepository UserInfoRepository { get; }
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}

using Chatterbox.Infrastructure.Models;

namespace Chatterbox.Infrastructure.Interfaces.Repositories
{
    public interface IAddableRepository<TEntity> where TEntity : BaseEntity
    {
        Task AddAsync(TEntity entity);
    }
}

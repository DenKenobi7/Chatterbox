using Chatterbox.Infrastructure.Models;

namespace Chatterbox.Infrastructure.Interfaces.Repositories
{
    public interface IDeletableRepository<TEntity> where TEntity : BaseEntity
    {
        Task<bool> DeleteAsync(string id);
    }
}

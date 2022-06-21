using Chatterbox.Infrastructure.Attributes;
using Chatterbox.Infrastructure.DBConnection;
using Chatterbox.Infrastructure.Interfaces.Repositories;
using Chatterbox.Infrastructure.Models;
using Chatterbox.Infrastructure.Shared.Providers;
using MongoDB.Driver;

namespace Chatterbox.Infrastructure.Repositories
{
    public class BaseMongoRepository<TEntity> : IAddableRepository<TEntity>, IDeletableRepository<TEntity>
        where TEntity : BaseEntity
    {
        protected readonly IMongoCollection<TEntity> _collection;
        protected readonly IMongoDatabase _db;
        protected readonly IDateTimeProvider _dateTimeProvider;
        public BaseMongoRepository(IMongoDBSettings settings, IDateTimeProvider dateTimeProvider)
        {
            _db = new MongoClient(settings.ConnectionString).GetDatabase(settings.DatabaseName);
            _collection = _db.GetCollection<TEntity>(GetCollectionName(typeof(TEntity)));
            _dateTimeProvider = dateTimeProvider;
        }
        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute)documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }

        public virtual IQueryable<TEntity> AsQueryable()
        {
            return _collection.AsQueryable();
        }

        public async Task AddAsync(TEntity entity)
        {
            entity.DateCreated = _dateTimeProvider.GetCurrentDateTime();
            await _collection.InsertOneAsync(entity, new InsertOneOptions());
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var entity = await _collection.Find(x => x.Id == id).SingleAsync();
            entity.IsDeleted = true;
            var result = await _collection.ReplaceOneAsync(x => x.Id == id, entity);
            return result.ModifiedCount == 1;
        }
    }
}

namespace EncryptionExchanger.Db
{
    public interface IMongoDBSettings
    {
        string DatabaseName { get; set; }
        string CollectionName { get; set; }
        string ConnectionString { get; set; }
    }
    public class MongoDBSettings : IMongoDBSettings
    {
        public string DatabaseName { get; set; } = string.Empty;
        public string CollectionName { get; set; } = string.Empty;
        public string ConnectionString { get; set; } = string.Empty;
    }
}

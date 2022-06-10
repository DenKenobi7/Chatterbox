using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Providers;
using Chatterbox.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Chatterbox.Infrastructure.DBConnection
{
    public static class MongoDBConnectionRegistrator
    {
        public static void RegisterMongoDBInfrastructure(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.Configure<MongoDBSettings>(configuration.GetSection("MongoDBConnnection"));
            services.AddSingleton<IMongoDBSettings>(serviceProvider =>
                serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value);
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        }
    }
}

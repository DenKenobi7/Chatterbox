using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Repositories;
using Chatterbox.Infrastructure.Shared.Providers;
using Microsoft.AspNetCore.Identity;
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
        public static void RegisterIdentityMongoStorage(this IdentityBuilder builder, ConfigurationManager configuration)
        {
            var mongoDbSettings = configuration.GetSection("MongoDBConnnection").Get<MongoDBSettings>();
            builder.AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>
                (
                    mongoDbSettings.ConnectionString, mongoDbSettings.DatabaseName
                );
        }
    }
}

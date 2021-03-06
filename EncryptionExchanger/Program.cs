using EncryptionExchanger.Db;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();

builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBConnnection"));
builder.Services.AddSingleton<IMongoDBSettings>(serviceProvider =>
    serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(cfg =>
{
    cfg.AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:4200")
    .AllowCredentials();
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

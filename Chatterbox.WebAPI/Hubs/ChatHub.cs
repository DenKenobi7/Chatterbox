using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Models;
using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Shared.Providers;
using Chatterbox.WebAPI.Models;
using Chatterbox.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using System.Security.Claims;

namespace Chatterbox.WebAPI.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatRepository _repository;
        private readonly CurrentUserService _currentUserService;
        private readonly IDateTimeProvider _dateTimeProvider;
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatHub(IChatRepository repository,
                       CurrentUserService currentUserService,
                       IDateTimeProvider dateTimeProvider,
                       UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _dateTimeProvider = dateTimeProvider;
            _userManager = userManager;
        }

        public override async Task OnConnectedAsync()
        {
            var id = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, id);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var id = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, id);
            }
        }

        public async Task ActivateChat(string chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        }

        public async Task DeactivateChat(string chatId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);        
        }

        public async Task InitiateChat(ChatCreateDto chatDto)
        {
            var creator = await _userManager.FindByIdAsync(chatDto.UserId);
            var companion = await _userManager.FindByIdAsync(chatDto.CompanionId);
            var chat = await _repository.CreateChatAsync(creator, companion, chatDto.Id);
            await Clients.User(_currentUserService.UserHubIdentifier)
                .SendAsync("ReceiveChatInvitation", chat);
        }

        public async Task SendMessage(PairedMessagesDto messages)
        {
            _currentUserService.User = Context.User;
            var selfEncrMes = new Message 
            {
                Id = messages.MessageSelfEncr.Id,
                DateCreated = messages.MessageSelfEncr.DateCreated,
                Text = messages.MessageSelfEncr.Text,
                DelieveredAt = _dateTimeProvider.GetCurrentDateTime(),
                Status = Message.MessageStatus.Sent,
                IsSelfEncrypted = true,
                SenderId = _currentUserService.UserId 
            };
            var compEncrMes = new Message
            {
                Id = BsonObjectId.GenerateNewId().ToString(),
                DateCreated = messages.MessageCompEncr.DateCreated,
                Text = messages.MessageCompEncr.Text,
                DelieveredAt = _dateTimeProvider.GetCurrentDateTime(),
                Status = Message.MessageStatus.Sent,
                IsSelfEncrypted = false,
                SenderId = _currentUserService.UserId
            };

            messages.MessageCompEncr.Id = compEncrMes.Id;

            await _repository.WriteMessageAsync(selfEncrMes, compEncrMes, messages.ChatId);
            await Clients.OthersInGroup(messages.ChatId)
                .SendAsync("ReceiveMessage", messages.MessageCompEncr);
        }
    }
}

using Chatterbox.Infrastructure.Dtos;
using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Chatterbox.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _repository;
        private UserManager<ApplicationUser> _userManager;
        private readonly CurrentUserService _currentUserService;

        public ChatController(IChatRepository repo, CurrentUserService currentUserService, UserManager<ApplicationUser> userManager)
        {
            _repository = repo;
            _userManager = userManager;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<ChatDetailsDto>> GetChat([FromQuery] string userId, string chatId)
        {
            return await _repository.GetChatWithMessagesAsync(userId, chatId);
        }

        [HttpGet("getUserChats")]
        public async Task<IList<ChatGetDto>> GetChats()
        {
            var userId = _currentUserService.UserId;
            return await _repository.GetChatsAsync(userId);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteChat([FromRoute] string id)
        {
            var result = await _repository.DeleteAsync(id);

            return StatusCode(200);
        }
    }
}
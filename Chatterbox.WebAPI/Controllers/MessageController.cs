using Chatterbox.Infrastructure.Interfaces.Interfaces;
using Chatterbox.Infrastructure.Models;
using Chatterbox.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;

namespace Chatterbox.WebAPI.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly IMessageRepository _repository;

        public MessageController(IMessageRepository repo)
        {
            _repository = repo;
        }

        [HttpGet("getMessages")]
        public async Task<IEnumerable<Message>> GetMessages([FromQuery] MessageIssuersModel model)
        {
            return await _repository.GetChatMessagesAsync(model.SenderId, model.RecipientId);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            await _repository.AddAsync(message);
            return StatusCode(200);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteMessage([FromRoute] string id)
        {
            var result = await _repository.DeleteAsync(id);
            return StatusCode(200);
        }
    }
}
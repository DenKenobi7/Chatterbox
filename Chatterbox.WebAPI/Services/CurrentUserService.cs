using Chatterbox.Infrastructure.Models.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Chatterbox.WebAPI.Services
{
    public class CurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor,
            UserManager<ApplicationUser> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public ClaimsPrincipal? User { get; set; }

        public string? UserId => _httpContextAccessor
            .HttpContext?
            .User.FindFirstValue("usId");
        public string? UserHubIdentifier => _httpContextAccessor
            .HttpContext?
            .User.FindFirstValue(ClaimTypes.NameIdentifier);

        public async Task<ApplicationUser> GetUser()
        {
            var id = (_httpContextAccessor.HttpContext?.User ?? User)
                .FindFirstValue(ClaimTypes.NameIdentifier);
            if (id == null)
            {
                throw new Exception("User id missed");
            }
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User was not found");
            }

            return user;
        }
    }
}

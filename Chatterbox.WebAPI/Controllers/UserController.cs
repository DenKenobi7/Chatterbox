using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Shared;
using Chatterbox.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Chatterbox.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        public UserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel userModel)
        {
            ApplicationUser appUser = await _userManager.FindByEmailAsync(userModel.Email);
            if (appUser != null)
            {
                SignInResult result = await _signInManager.PasswordSignInAsync(appUser, userModel.Password, false, false);
                if (result.Succeeded)
                {
                    return Ok();

                }
            }
            return Unauthorized("Email or password isn't correct");
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registerModel)
        {
            ApplicationUser appUser = new ApplicationUser
            {
                UserName = registerModel.UserName,
                Email = registerModel.Email,
                FirstName = registerModel.FirstName,
                LastName = registerModel.LastName
            };

            IdentityResult result = await _userManager.CreateAsync(appUser, registerModel.Password);
            if (!result.Succeeded)
            {
                return Unauthorized("Something went wrong while registering");
            }

            await _userManager.AddToRoleAsync(appUser, Enums.Roles.User.ToString());
            return Ok();
        }
    }
}

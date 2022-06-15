using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Shared;
using Chatterbox.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chatterbox.WebAPI.Controllers
{
    [ApiController]
    [Route("auth")]
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
            ApplicationUser user = await _userManager.FindByEmailAsync(userModel.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, userModel.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("usId", user.Id.ToString())
                };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim("role", userRole));
                }
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("7S79jvOkEdwoRqHx"));
                var token = new JwtSecurityToken(
                    expires: DateTime.Now.AddMinutes(30),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                HttpContext.Response.Cookies.Append(".AspNetCore.Application.Id", new JwtSecurityTokenHandler().WriteToken(token),
                    new CookieOptions
                    {
                        MaxAge = TimeSpan.FromMinutes(30)
                    });
                return Ok(new
                {
                    expiration = token.ValidTo,
                    username = user.UserName
                });
            }
            return Unauthorized();

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

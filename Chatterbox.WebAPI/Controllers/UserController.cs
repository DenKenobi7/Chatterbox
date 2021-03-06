using Chatterbox.Infrastructure.Dtos;
using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Shared;
using Chatterbox.WebAPI.Models;
using Chatterbox.WebAPI.Services;
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
    [Route("user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<ApplicationRole> _roleManager;
        private readonly CurrentUserService _currentUserService;
        public UserController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, CurrentUserService currentUserService)
        {
            _userManager = userManager;
            _currentUserService = currentUserService;
            _roleManager = roleManager;
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
                    id = user.Id.ToString(),
                    expiration = token.ValidTo,
                    userName = user.UserName
                });
            }
            return Unauthorized(new { ErrorMessage = "Email or Password is invalid"});

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
                return Unauthorized(new { ErrorMessage = "Something went wrong while registering" });
            }

            var resultRole = await _userManager.AddToRoleAsync(appUser, Enums.Roles.User.ToString());
            
            return Ok();
        }

        [HttpGet("getAvailableUsers")]
        public ActionResult<IList<UserGetDto>> GetAvailableUsers()
        {
            var userRole = _roleManager.Roles.Where(r => r.Name == "User").Select(r => r.Id).First();
            var users = _userManager.Users.ToList();

            users = users.Where(u => u.Roles.Contains(userRole) &&
                                           u.Id.ToString() != _currentUserService.UserId)
                                .ToList(); 
            
            return users.Select(u => new UserGetDto 
                               { 
                                   Id = u.Id.ToString(), 
                                   UserName = u.UserName,
                                   FirstName = u.FirstName,
                                   LastName = u.LastName
                               })
                               .ToList();
        }
    }
}

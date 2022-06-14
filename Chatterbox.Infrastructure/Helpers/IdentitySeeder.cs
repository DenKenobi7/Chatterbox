using Chatterbox.Infrastructure.Models.Identity;
using Chatterbox.Infrastructure.Shared;
using Microsoft.AspNetCore.Identity;

namespace Chatterbox.Infrastructure.Helpers
{
    public static class IdentitySeeder
    {
        public static async Task SeedRolesAsync(RoleManager<ApplicationRole> roleManager)
        {
            foreach (var role in Enum.GetNames(typeof(Enums.Roles)))
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    ApplicationRole newRole = new ApplicationRole(role);
                    await roleManager.CreateAsync(newRole);
                }
            }
        }
        public static async Task SeedAdminAsync(UserManager<ApplicationUser> userManager)
        {
            var defaultAdmin = new ApplicationUser
            {
                UserName = "den_den",
                Email = "denys.teslenko1@gmail.com",
                FirstName = "Denys",
                LastName = "Teslenko",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true
            };
            if (await userManager.FindByEmailAsync(defaultAdmin.Email) is null)
            {
                await userManager.CreateAsync(defaultAdmin, "11223344");
            }
        }
        public static async Task SeedRolesAndAdminAsync(RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            await SeedRolesAsync(roleManager);
            await SeedAdminAsync(userManager);
        }
    }
}

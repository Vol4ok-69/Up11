using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Up11.Api.Helpers;
namespace Up11.Api.Helpers;

public class MinimumRoleHandler : AuthorizationHandler<MinimumRoleRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        MinimumRoleRequirement requirement)
    {
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

        if (role is null)
            return Task.CompletedTask;

        var userLevel = RoleHierarchy.GetLevel(role);

        if (userLevel >= requirement.MinimumLevel)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
using Microsoft.AspNetCore.Authorization;

namespace Up11.Api.Helpers;

public class MinimumRoleRequirement(int minimumLevel) : IAuthorizationRequirement
{
    public int MinimumLevel { get; } = minimumLevel;
}
using Up11.Api.Models;

namespace Up11.Api.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user, string roleName);
}
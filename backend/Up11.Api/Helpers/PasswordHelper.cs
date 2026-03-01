using BCryptNet = BCrypt.Net.BCrypt;

namespace Up11.Api.Helpers;

public static class PasswordHelper
{
    public static string Hash(string password)
        => BCryptNet.HashPassword(password);

    public static bool Verify(string password, string hash)
        => BCryptNet.Verify(password, hash);
}
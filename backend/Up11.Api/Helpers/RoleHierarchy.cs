namespace Up11.Api.Helpers;

public static class RoleHierarchy
{
    public static int GetLevel(string role) => role switch
    {
        "Гость" => (int)RoleLevel.Guest,
        "Игрок" => (int)RoleLevel.Player,
        "Капитан" => (int)RoleLevel.Captain,
        "Организатор" => (int)RoleLevel.Organizer,
        "Администратор" => (int)RoleLevel.Administrator,
        _ => 0
    };
}
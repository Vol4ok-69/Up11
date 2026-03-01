using Microsoft.EntityFrameworkCore;
using Up11.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Up11.Api.Interfaces;
using Up11.Api.Services;
using Up11.Api.Middlewares;
using Up11.Api.Helpers;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy => policy.Requirements.Add(
            new MinimumRoleRequirement((int)RoleLevel.Administrator)))
    .AddPolicy("OrganizerOrHigher", policy => policy.Requirements.Add(
            new MinimumRoleRequirement((int)RoleLevel.Organizer)))
    .AddPolicy("CaptainOrHigher", policy => policy.Requirements.Add(
            new MinimumRoleRequirement((int)RoleLevel.Captain)));

builder.Services.AddSingleton<IAuthorizationHandler, MinimumRoleHandler>();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDisciplineService, DisciplineService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ITeamMemberService, TeamMemberService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddScoped<IBracketService, BracketService>();
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<ITournamentStatusService, TournamentStatusService>();
builder.Services.AddScoped<ITournamentSystemService, TournamentSystemService>();


builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
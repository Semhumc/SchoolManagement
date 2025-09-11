using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchoolManagement.Data;
using SchoolManagement.Repositories;
using SchoolManagement.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Frontend'inizin çalıştığı adres
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Tüm servisleri ekle
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<TeacherService>();
builder.Services.AddScoped<ClassService>();
builder.Services.AddScoped<ClassManagementService>();
builder.Services.AddScoped<AttendanceService>();
builder.Services.AddScoped<ScoreService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<ClassTeacherService>();
builder.Services.AddScoped<ClassTeacherRepository>();


// JWT Authentication ayarı
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddControllers();

var app = builder.Build();

// Use CORS middleware
app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
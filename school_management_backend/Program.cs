using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchoolManagement.Data;
using SchoolManagement.Repositories;
using SchoolManagement.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// CORS yapılandırması - tek seferde tanımla
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Frontend portlarını ekle
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // Credentials'a izin ver
        });
});

// Database context
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
builder.Services.AddScoped<ClassScheduleService>();

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

// Development ortamında daha detaylı hata mesajları
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

// CORS'u authentication'dan önce kullan
app.UseCors("AllowSpecificOrigin");

app.UseAuthentication(); // önce authentication
app.UseAuthorization();  // sonra authorization

app.MapControllers();

app.Run();
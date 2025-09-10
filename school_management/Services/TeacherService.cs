using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class TeacherService
    {
        private readonly ApplicationDbContext _context;

        public TeacherService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TeacherDto>> GetAllAsync()
        {
            return await _context.Users
                .Where(u => u.Role == RoleEnum.Teacher)
                .Select(u => new TeacherDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString()
                })
                .ToListAsync();
        }

        public async Task<TeacherDto?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Where(u => u.Id == id && u.Role == RoleEnum.Teacher)
                .Select(u => new TeacherDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<TeacherDto> CreateAsync(CreateTeacherDto dto)
        {
            var teacher = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = dto.Password, // şimdilik düz şifre
                Phone = dto.Phone,
                Role = RoleEnum.Teacher
            };

            _context.Users.Add(teacher);
            await _context.SaveChangesAsync();

            return new TeacherDto
            {
                Id = teacher.Id,
                FirstName = teacher.FirstName,
                LastName = teacher.LastName,
                Email = teacher.Email,
                Phone = teacher.Phone,
                Role = teacher.Role.ToString()
            };
        }

        public async Task<TeacherDto?> UpdateAsync(int id, CreateTeacherDto dto)
        {
            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == RoleEnum.Teacher);
            if (teacher == null) return null;

            teacher.FirstName = dto.FirstName;
            teacher.LastName = dto.LastName;
            teacher.Email = dto.Email;
            teacher.Phone = dto.Phone;
            teacher.PasswordHash = dto.Password;

            _context.Users.Update(teacher);
            await _context.SaveChangesAsync();

            return new TeacherDto
            {
                Id = teacher.Id,
                FirstName = teacher.FirstName,
                LastName = teacher.LastName,
                Email = teacher.Email,
                Phone = teacher.Phone,
                Role = teacher.Role.ToString()
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var teacher = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == RoleEnum.Teacher);
            if (teacher == null) return false;

            _context.Users.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class StudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Tüm öğrencileri getir
        public async Task<List<StudentDto>> GetAllAsync()
        {
            return await _context.Users
                .Where(u => u.Role == RoleEnum.Student)
                .Select(u => new StudentDto
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

        // Tek öğrenci getir
        public async Task<StudentDto?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Where(u => u.Id == id && u.Role == RoleEnum.Student)
                .Select(u => new StudentDto
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

        // Yeni öğrenci ekle
        public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
        {
            var student = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = dto.Password, // şimdilik düz şifre
                Phone = dto.Phone,
                Role = RoleEnum.Student
            };

            _context.Users.Add(student);
            await _context.SaveChangesAsync();

            return new StudentDto
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Email = student.Email,
                Phone = student.Phone,
                Role = student.Role.ToString()
            };
        }

        // Öğrenci güncelle
        public async Task<StudentDto?> UpdateAsync(int id, CreateStudentDto dto)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == RoleEnum.Student);
            if (student == null) return null;

            student.FirstName = dto.FirstName;
            student.LastName = dto.LastName;
            student.Email = dto.Email;
            student.Phone = dto.Phone;
            student.PasswordHash = dto.Password; // şimdilik düz şifre

            _context.Users.Update(student);
            await _context.SaveChangesAsync();

            return new StudentDto
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Email = student.Email,
                Phone = student.Phone,
                Role = student.Role.ToString()
            };
        }

        // Öğrenci sil
        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == RoleEnum.Student);
            if (student == null) return false;

            _context.Users.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class ClassService
    {
        private readonly ApplicationDbContext _context;

        public ClassService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Admin: tüm dersleri getir
        public async Task<List<ClassDto>> GetAllAsync()
        {
            return await _context.Classes
                .Include(c => c.ClassTeachers).ThenInclude(ct => ct.Teacher)
                .Include(c => c.ClassStudents).ThenInclude(cs => cs.Student)
                .Select(c => new ClassDto
                {
                    Id = c.Id,
                    ClassName = c.ClassName,
                    Teachers = c.ClassTeachers.Select(t => t.Teacher.FirstName + " " + t.Teacher.LastName).ToList(),
                    Students = c.ClassStudents.Select(s => s.Student.FirstName + " " + s.Student.LastName).ToList()
                })
                .ToListAsync();
        }

        // Teacher: kendi derslerini getir
        public async Task<List<ClassDto>> GetByTeacherIdAsync(int teacherId)
        {
            return await _context.ClassTeachers
                .Where(ct => ct.TeacherId == teacherId)
                .Include(ct => ct.Class).ThenInclude(c => c.ClassStudents).ThenInclude(cs => cs.Student)
                .Select(ct => new ClassDto
                {
                    Id = ct.Class.Id,
                    ClassName = ct.Class.ClassName,
                    Teachers = ct.Class.ClassTeachers.Select(t => t.Teacher.FirstName + " " + t.Teacher.LastName).ToList(),
                    Students = ct.Class.ClassStudents.Select(s => s.Student.FirstName + " " + s.Student.LastName).ToList()
                })
                .ToListAsync();
        }

        // Admin: ders oluştur
        public async Task<ClassDto> CreateAsync(CreateClassDto dto)
        {
            var newClass = new Class
            {
                ClassName = dto.ClassName
            };

            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();

            return new ClassDto
            {
                Id = newClass.Id,
                ClassName = newClass.ClassName,
                Teachers = new List<string>(),
                Students = new List<string>()
            };
        }

        // Admin: ders sil
        public async Task<bool> DeleteAsync(int id)
        {
            var classEntity = await _context.Classes.FindAsync(id);
            if (classEntity == null) return false;

            _context.Classes.Remove(classEntity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Teacher: derse öğrenci ekle
        public async Task<bool> AddStudentAsync(int classId, int studentId)
        {
            var exists = await _context.ClassStudents.AnyAsync(cs => cs.ClassId == classId && cs.StudentId == studentId);
            if (exists) return false;

            _context.ClassStudents.Add(new ClassStudent
            {
                ClassId = classId,
                StudentId = studentId
            });

            await _context.SaveChangesAsync();
            return true;
        }

        // Teacher: dersten öğrenci çıkar
        public async Task<bool> RemoveStudentAsync(int classId, int studentId)
        {
            var classStudent = await _context.ClassStudents
                .FirstOrDefaultAsync(cs => cs.ClassId == classId && cs.StudentId == studentId);

            if (classStudent == null) return false;

            _context.ClassStudents.Remove(classStudent);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

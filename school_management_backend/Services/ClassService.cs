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
            var classes = await _context.Classes
                .Include(c => c.ClassTeachers) // Sadece ClassTeachers'ı dahil et
                .Include(c => c.ClassStudents).ThenInclude(cs => cs.Student)
                .ToListAsync();

            var classDtos = new List<ClassDto>();
            foreach (var cls in classes)
            {
                var teacherNames = new List<string>();
                foreach (var classTeacher in cls.ClassTeachers)
                {
                    // Her ClassTeacher için Öğretmeni manuel olarak yükle
                    var teacher = await _context.Users.FindAsync(classTeacher.TeacherId);
                    if (teacher != null)
                    {
                        teacherNames.Add($"{teacher.FirstName} {teacher.LastName}");
                    }
                }

                classDtos.Add(new ClassDto
                {
                    Id = cls.Id,
                    ClassName = cls.ClassName,
                    Teachers = teacherNames,
                    Students = cls.ClassStudents.Select(s => s.Student!.FirstName + " " + s.Student!.LastName).ToList()
                });
            }
            return classDtos;
        }

        // Teacher: kendi derslerini getir
        public async Task<List<ClassDto>> GetByTeacherIdAsync(int teacherId)
        {
            return await _context.ClassTeachers
                .Where(ct => ct.TeacherId == teacherId)
                .Include(ct => ct.Class).ThenInclude(c => c.ClassStudents).ThenInclude(cs => cs.Student)
                .Include(ct => ct.Class).ThenInclude(c => c.ClassTeachers).ThenInclude(ct => ct.Teacher)
                .Select(ct => new ClassDto
                {
                    Id = ct.Class.Id,
                    ClassName = ct.Class.ClassName,
                    Teachers = ct.Class.ClassTeachers.Select(t => t.Teacher!.FirstName + " " + t.Teacher!.LastName).ToList(),
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

            await _context.Classes.AddAsync(newClass);
            await _context.SaveChangesAsync();

            // Seçilen öğretmenleri derse ata
            if (dto.TeacherIds != null && dto.TeacherIds.Any())
            {
                foreach (var teacherId in dto.TeacherIds)
                {
                    var classTeacher = new ClassTeacher
                    {
                        ClassId = newClass.Id,
                        TeacherId = teacherId
                    };
                    await _context.ClassTeachers.AddAsync(classTeacher);
                }
                await _context.SaveChangesAsync();
            }

            // DTO'yu dönmeden önce öğretmen isimlerini doldur
            var teacherNames = await _context.Users
                .Where(u => dto.TeacherIds.Contains(u.Id))
                .Select(u => u.FirstName + " " + u.LastName)
                .ToListAsync();

            return new ClassDto
            {
                Id = newClass.Id,
                ClassName = newClass.ClassName,
                Teachers = teacherNames,
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

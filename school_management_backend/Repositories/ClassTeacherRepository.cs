using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.Entities;

namespace SchoolManagement.Repositories
{
    public class ClassTeacherRepository
    {
        private readonly ApplicationDbContext _context;

        public ClassTeacherRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClassTeacher>> GetClassesByTeacher(Guid teacherId)
        {
            return await _context.ClassTeachers
                .Include(ct => ct.Class)
                .Include(ct => ct.Teacher)
                .Where(ct => ct.TeacherId == teacherId)
                .ToListAsync();
        }
    }
}

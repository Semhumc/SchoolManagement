using SchoolManagement.DTOs;
using SchoolManagement.Repositories;

namespace SchoolManagement.Services
{
    public class ClassTeacherService
    {
        private readonly ClassTeacherRepository _classTeacherRepository;

        public ClassTeacherService(ClassTeacherRepository classTeacherRepository)
        {
            _classTeacherRepository = classTeacherRepository;
        }

        public async Task<IEnumerable<ClassTeacherDto>> GetClassesByTeacher(Guid teacherId)
        {
            var classTeachers = await _classTeacherRepository.GetClassesByTeacher(teacherId);
            return classTeachers.Select(ct => new ClassTeacherDto
            {
                Id = ct.ClassId,
                Name = ct.Class.Name,
                TeacherId = ct.TeacherId,
                TeacherName = ct.Teacher.FirstName
            });
        }
    }
}

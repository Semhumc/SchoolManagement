using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class ClassScheduleService
    {
        private readonly ApplicationDbContext _context;

        public ClassScheduleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ClassScheduleDto> CreateAsync(CreateClassScheduleDto dto)
        {
            var classSchedule = new ClassSchedule
            {
                ClassId = dto.ClassId,
                TeacherId = dto.TeacherId,
                ScheduleDate = dto.ScheduleDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.ClassSchedules.Add(classSchedule);
            await _context.SaveChangesAsync();

            // DTO'ya dönüştürürken ilişkili verileri yükle
            var createdSchedule = await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Teacher)
                .FirstOrDefaultAsync(cs => cs.ClassScheduleId == classSchedule.ClassScheduleId);

            return new ClassScheduleDto
            {
                ClassScheduleId = createdSchedule!.ClassScheduleId,
                ClassId = createdSchedule.ClassId,
                ClassName = createdSchedule!.Class?.ClassName,
                TeacherId = createdSchedule.TeacherId,
                                TeacherName = createdSchedule!.Teacher?.FirstName + " " + createdSchedule!.Teacher?.LastName,
                ScheduleDate = createdSchedule.ScheduleDate,
                StartTime = createdSchedule.StartTime,
                EndTime = createdSchedule.EndTime,
                };
        }

        public async Task<List<ClassScheduleDto>> GetAllAsync()
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Teacher)
                .Select(cs => new ClassScheduleDto
                {
                    ClassScheduleId = cs.ClassScheduleId,
                    ClassId = cs.ClassId,
                    ClassName = cs.Class!.ClassName,
                    TeacherId = cs.TeacherId,
                    TeacherName = cs.Teacher!.FirstName + " " + cs.Teacher!.LastName,
                    ScheduleDate = cs.ScheduleDate,
                    StartTime = cs.StartTime,
                    EndTime = cs.EndTime,
                    
                })
                .ToListAsync();
        }

        public async Task<ClassScheduleDto?> GetByIdAsync(int id)
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Teacher)
                .Where(cs => cs.ClassScheduleId == id)
                .Select(cs => new ClassScheduleDto
                {
                    ClassScheduleId = cs.ClassScheduleId,
                    ClassId = cs.ClassId,
                    ClassName = cs.Class!.ClassName,
                    TeacherId = cs.TeacherId,
                    TeacherName = cs.Teacher!.FirstName + " " + cs.Teacher!.LastName,
                    ScheduleDate = cs.ScheduleDate,
                    StartTime = cs.StartTime,
                    EndTime = cs.EndTime
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAsync(int id, CreateClassScheduleDto dto)
        {
            var classSchedule = await _context.ClassSchedules.FindAsync(id);
            if (classSchedule == null) return false;

            classSchedule.ClassId = dto.ClassId;
            classSchedule.TeacherId = dto.TeacherId;
            classSchedule.ScheduleDate = dto.ScheduleDate;
            classSchedule.StartTime = dto.StartTime;
            classSchedule.EndTime = dto.EndTime;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var classSchedule = await _context.ClassSchedules.FindAsync(id);
            if (classSchedule == null) return false;

            _context.ClassSchedules.Remove(classSchedule);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ClassScheduleDto>> GetByTeacherIdAsync(int teacherId)
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Teacher)
                .Where(cs => cs.TeacherId == teacherId)
                .Select(cs => new ClassScheduleDto
                {
                    ClassScheduleId = cs.ClassScheduleId,
                    ClassId = cs.ClassId,
                    ClassName = cs.Class!.ClassName,
                    TeacherId = cs.TeacherId,
                    TeacherName = cs.Teacher!.FirstName + " " + cs.Teacher!.LastName,
                    ScheduleDate = cs.ScheduleDate,
                    StartTime = cs.StartTime,
                    EndTime = cs.EndTime
                })
                .ToListAsync();
        }
    }
}
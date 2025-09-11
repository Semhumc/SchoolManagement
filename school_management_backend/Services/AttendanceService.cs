using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class AttendanceService
    {
        private readonly ApplicationDbContext _context;

        public AttendanceService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Teacher: devamsızlık kaydı ekle
        public async Task<AttendanceDto> AddAttendanceAsync(CreateAttendanceDto dto)
        {
            var attendance = new Attendance
            {
                StudentId = dto.StudentId,
                ClassScheduleId = dto.ClassScheduleId,
                IsPresent = dto.IsPresent
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            var schedule = await _context.ClassSchedules
                .Include(cs => cs.Class)
                .FirstOrDefaultAsync(cs => cs.ClassScheduleId == dto.ClassScheduleId);

            return new AttendanceDto
            {
                Id = attendance.Id,
                StudentName = (await _context.Users.FindAsync(dto.StudentId))?.FirstName ?? "Unknown",
                ClassName = schedule?.Class?.ClassName ?? "Unknown",
                Date = schedule?.ScheduleDate ?? DateTime.UtcNow,
                IsPresent = attendance.IsPresent
            };
        }

        // Student: kendi devamsızlıklarını gör
        public async Task<List<AttendanceDto>> GetMyAttendanceAsync(int studentId)
        {
            return await _context.Attendances
                .Where(a => a.StudentId == studentId)
                .Include(a => a.ClassSchedule)
                    .ThenInclude(cs => cs.Class)
                    .Include(a => a.Student)
                .Select(a => new AttendanceDto
                {
                    Id = a.Id,
                    StudentName = a.Student!.FirstName + " " + a.Student!.LastName,
                    ClassName = a.ClassSchedule.Class!.ClassName,
                    Date = a.ClassSchedule.ScheduleDate,
                    IsPresent = a.IsPresent
                })
                .ToListAsync();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class ClassScheduleService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ClassScheduleService> _logger;

        public ClassScheduleService(ApplicationDbContext context, ILogger<ClassScheduleService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ClassScheduleDto> CreateAsync(CreateClassScheduleDto dto)
        {
            try
            {
                // Önce Class ve Teacher'ın mevcut olduğunu kontrol et
                var classExists = await _context.Classes.AnyAsync(c => c.Id == dto.ClassId);
                var teacherExists = await _context.Users.AnyAsync(u => u.Id == dto.TeacherId && u.Role == RoleEnum.Teacher);

                if (!classExists)
                {
                    throw new ArgumentException($"Class with ID {dto.ClassId} not found");
                }

                if (!teacherExists)
                {
                    throw new ArgumentException($"Teacher with ID {dto.TeacherId} not found");
                }

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

                if (createdSchedule == null)
                {
                    throw new InvalidOperationException("Created schedule could not be retrieved");
                }

                return new ClassScheduleDto
                {
                    ClassScheduleId = createdSchedule.ClassScheduleId,
                    ClassId = createdSchedule.ClassId,
                    ClassName = createdSchedule.Class?.ClassName ?? "Unknown",
                    TeacherId = createdSchedule.TeacherId,
                    TeacherName = createdSchedule.Teacher != null ?
                        $"{createdSchedule.Teacher.FirstName} {createdSchedule.Teacher.LastName}" : "Unknown",
                    ScheduleDate = createdSchedule.ScheduleDate,
                    StartTime = createdSchedule.StartTime.ToString(@"hh\:mm"),
                    EndTime = createdSchedule.EndTime.ToString(@"hh\:mm"),
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating class schedule");
                throw;
            }
        }

        public async Task<List<ClassScheduleDto>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Getting all class schedules");

                var schedules = await _context.ClassSchedules
                    .Include(cs => cs.Class)
                    .Include(cs => cs.Teacher)
                    .Select(cs => new ClassScheduleDto
                    {
                        ClassScheduleId = cs.ClassScheduleId,
                        ClassId = cs.ClassId,
                        ClassName = cs.Class.ClassName != null ? cs.Class.ClassName : "Unknown",
                        TeacherId = cs.TeacherId,
                        TeacherName = cs.Teacher != null ?
                            cs.Teacher.FirstName + " " + cs.Teacher.LastName : "Unknown",
                        ScheduleDate = cs.ScheduleDate,
                        StartTime = cs.StartTime.ToString(@"hh\:mm"),
                        EndTime = cs.EndTime.ToString(@"hh\:mm"),
                    })
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {schedules.Count} class schedules");
                return schedules;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all class schedules");
                throw;
            }
        }

        public async Task<ClassScheduleDto?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.ClassSchedules
                    .Include(cs => cs.Class)
                    .Include(cs => cs.Teacher)
                    .Where(cs => cs.ClassScheduleId == id)
                    .Select(cs => new ClassScheduleDto
                    {
                        ClassScheduleId = cs.ClassScheduleId,
                        ClassId = cs.ClassId,
                        ClassName = cs.Class != null ? cs.Class.ClassName : "Unknown",
                        TeacherId = cs.TeacherId,
                        TeacherName = cs.Teacher != null ?
                            cs.Teacher.FirstName + " " + cs.Teacher.LastName : "Unknown",
                        ScheduleDate = cs.ScheduleDate,
                        StartTime = cs.StartTime.ToString(@"hh\:mm"),
                        EndTime = cs.EndTime.ToString(@"hh\:mm")
                    })
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting class schedule with id {id}");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(int id, CreateClassScheduleDto dto)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating class schedule with id {id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var classSchedule = await _context.ClassSchedules.FindAsync(id);
                if (classSchedule == null) return false;

                _context.ClassSchedules.Remove(classSchedule);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting class schedule with id {id}");
                throw;
            }
        }

        public async Task<List<ClassScheduleDto>> GetByTeacherIdAsync(int teacherId)
        {
            try
            {
                return await _context.ClassSchedules
                    .Include(cs => cs.Class)
                    .Include(cs => cs.Teacher)
                    .Where(cs => cs.TeacherId == teacherId)
                    .Select(cs => new ClassScheduleDto
                    {
                        ClassScheduleId = cs.ClassScheduleId,
                        ClassId = cs.ClassId,
                        ClassName = cs.Class != null ? cs.Class.ClassName : "Unknown",
                        TeacherId = cs.TeacherId,
                        TeacherName = cs.Teacher != null ?
                            cs.Teacher.FirstName + " " + cs.Teacher.LastName : "Unknown",
                        ScheduleDate = cs.ScheduleDate,
                        StartTime = cs.StartTime.ToString(@"hh\:mm"),
                        EndTime = cs.EndTime.ToString(@"hh\:mm")
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting class schedules for teacher {teacherId}");
                throw;
            }
        }
    }
}
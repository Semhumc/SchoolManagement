using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class ScoreService
    {
        private readonly ApplicationDbContext _context;

        public ScoreService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Teacher: not ekle
        public async Task<ScoreDto> AddScoreAsync(int teacherId, CreateScoreDto dto)
        {
            var score = new Score
            {
                StudentId = dto.StudentId,
                TeacherId = teacherId,
                ClassId = dto.ClassId,
                Value = dto.Value
            };

            _context.Scores.Add(score);
            await _context.SaveChangesAsync();

            return new ScoreDto
            {
                Id = score.Id,
                StudentName = (await _context.Users.FindAsync(dto.StudentId))?.FirstName ?? "Unknown",
                TeacherName = (await _context.Users.FindAsync(teacherId))?.FirstName ?? "Unknown",
                ClassName = (await _context.Classes.FindAsync(dto.ClassId))?.ClassName ?? "Unknown",
                Value = score.Value,
                CreatedAt = score.CreatedAt
            };
        }

        // Student: kendi notlarını gör
        public async Task<List<ScoreDto>> GetScoresByStudentAsync(int studentId)
        {
            return await _context.Scores
                .Where(s => s.StudentId == studentId)
                .Include(s => s.Teacher)
                .Include(s => s.Class)
                .Select(s => new ScoreDto
                {
                    Id = s.Id,
                    StudentName = s.Student.FirstName + " " + s.Student.LastName,
                    TeacherName = s.Teacher.FirstName + " " + s.Teacher.LastName,
                    ClassName = s.Class.ClassName,
                    Value = s.Value,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();
        }
    }
}

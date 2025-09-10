using Microsoft.EntityFrameworkCore;
using SchoolManagement.Data;
using SchoolManagement.DTOs;
using SchoolManagement.Entities;

namespace SchoolManagement.Services
{
    public class CommentService
    {
        private readonly ApplicationDbContext _context;

        public CommentService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Teacher: yorum ekle
        public async Task<CommentDto> AddCommentAsync(int teacherId, CreateCommentDto dto)
        {
            var comment = new Comment
            {
                StudentId = dto.StudentId,
                TeacherId = teacherId,
                ClassId = dto.ClassId,
                CommentText = dto.CommentText
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return new CommentDto
            {
                Id = comment.Id,
                StudentName = (await _context.Users.FindAsync(dto.StudentId))?.FirstName ?? "Unknown",
                TeacherName = (await _context.Users.FindAsync(teacherId))?.FirstName ?? "Unknown",
                ClassName = (await _context.Classes.FindAsync(dto.ClassId))?.ClassName ?? "Unknown",
                CommentText = comment.CommentText,
                CreatedAt = comment.CreatedAt
            };
        }

        // Student: kendi yorumlarını gör
        public async Task<List<CommentDto>> GetCommentsByStudentAsync(int studentId)
        {
            return await _context.Comments
                .Where(c => c.StudentId == studentId)
                .Include(c => c.Teacher)
                .Include(c => c.Class)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    StudentName = c.Student.FirstName + " " + c.Student.LastName,
                    TeacherName = c.Teacher.FirstName + " " + c.Teacher.LastName,
                    ClassName = c.Class.ClassName,
                    CommentText = c.CommentText,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }
    }
}

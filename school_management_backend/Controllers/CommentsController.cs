using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentsController(CommentService commentService)
        {
            _commentService = commentService;
        }

        // Teacher: yorum ekle
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddComment(CreateCommentDto dto)
        {
            var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _commentService.AddCommentAsync(teacherId, dto);
            return Ok(result);
        }

        // Student: kendi yorumlarını gör
        [HttpGet("my")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyComments()
        {
            var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var comments = await _commentService.GetCommentsByStudentAsync(studentId);
            return Ok(comments);
        }
    }
}

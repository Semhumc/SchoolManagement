using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoresController : ControllerBase
    {
        private readonly ScoreService _scoreService;

        public ScoresController(ScoreService scoreService)
        {
            _scoreService = scoreService;
        }

        // Teacher: öğrenciye not ekle
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddScore(CreateScoreDto dto)
        {
            var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _scoreService.AddScoreAsync(teacherId, dto);
            return Ok(result);
        }

        // Student: kendi notlarını gör
        [HttpGet("my")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyScores()
        {
            var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var scores = await _scoreService.GetScoresByStudentAsync(studentId);
            return Ok(scores);
        }
    }
}

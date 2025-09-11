using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceService _attendanceService;

        public AttendanceController(AttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // Teacher: devamsızlık kaydı ekle
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddAttendance(CreateAttendanceDto dto)
        {
            var result = await _attendanceService.AddAttendanceAsync(dto);
            return Ok(result);
        }

        // Student: kendi devamsızlıklarını gör
        [HttpGet("my")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyAttendance()
        {
            var studentId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var attendance = await _attendanceService.GetMyAttendanceAsync(studentId);
            return Ok(attendance);
        }
    }
}

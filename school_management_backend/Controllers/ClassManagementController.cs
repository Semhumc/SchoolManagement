using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassManagementController : ControllerBase
    {
        private readonly ClassManagementService _service;

        public ClassManagementController(ClassManagementService service)
        {
            _service = service;
        }

        // Teacher: dersin durumunu güncelle
        [HttpPut("{classScheduleId}/status")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> UpdateStatus(int classScheduleId, UpdateClassStatusDto dto)
        {
            var success = await _service.UpdateClassStatusAsync(classScheduleId, dto.Status);
            if (!success) return BadRequest("Geçersiz classScheduleId veya status.");
            return Ok(new { message = "Ders durumu güncellendi." });
        }
    }
}

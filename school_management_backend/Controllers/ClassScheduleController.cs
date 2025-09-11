using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassScheduleController : ControllerBase
    {
        private readonly ClassScheduleService _classScheduleService;

        public ClassScheduleController(ClassScheduleService classScheduleService)
        {
            _classScheduleService = classScheduleService;
        }

        // Admin: Tüm ders programlarını getir
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var schedules = await _classScheduleService.GetAllAsync();
            return Ok(schedules);
        }

        // Admin: Belirli bir ders programını getir
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var schedule = await _classScheduleService.GetByIdAsync(id);
            if (schedule == null) return NotFound();
            return Ok(schedule);
        }

        // Admin: Ders programı oluştur
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateClassScheduleDto dto)
        {
            var createdSchedule = await _classScheduleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdSchedule.ClassScheduleId }, createdSchedule);
        }

        // Admin: Ders programı güncelle
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateClassScheduleDto dto)
        {
            var success = await _classScheduleService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

                // Admin: Ders programı sil
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _classScheduleService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // Teacher: Kendi ders programlarını getir
        [HttpGet("my-schedules")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetMySchedules()
        {
            var teacherId = int.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
            var schedules = await _classScheduleService.GetByTeacherIdAsync(teacherId);
            return Ok(schedules);
        }
    }
}
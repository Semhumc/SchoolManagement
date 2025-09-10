using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly ClassService _classService;

        public ClassesController(ClassService classService)
        {
            _classService = classService;
        }

        // Admin: tüm dersler
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var classes = await _classService.GetAllAsync();
            return Ok(classes);
        }

        // Teacher: kendi dersleri
        [HttpGet("my-classes")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetMyClasses()
        {
            var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var classes = await _classService.GetByTeacherIdAsync(teacherId);
            return Ok(classes);
        }

        // Admin: ders oluştur
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateClassDto dto)
        {
            var created = await _classService.CreateAsync(dto);
            return Ok(created);
        }

        // Admin: ders sil
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _classService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // Teacher: derse öğrenci ekle
        [HttpPost("{id}/students/{studentId}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddStudent(int id, int studentId)
        {
            var success = await _classService.AddStudentAsync(id, studentId);
            if (!success) return BadRequest("Öğrenci zaten bu derste.");
            return Ok(new { message = "Öğrenci eklendi." });
        }

        // Teacher: dersten öğrenci çıkar
        [HttpDelete("{id}/students/{studentId}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> RemoveStudent(int id, int studentId)
        {
            var success = await _classService.RemoveStudentAsync(id, studentId);
            if (!success) return NotFound("Öğrenci bu derste bulunamadı.");
            return Ok(new { message = "Öğrenci silindi." });
        }
    }
}

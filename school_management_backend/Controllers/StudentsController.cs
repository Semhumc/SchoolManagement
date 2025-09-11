using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly StudentService _studentService;

        public StudentsController(StudentService studentService)
        {
            _studentService = studentService;
        }

        // Admin & Teacher tüm öğrencileri görebilir
        [HttpGet]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync();
            return Ok(students);
        }

        // Admin & Teacher öğrenci detay
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _studentService.GetByIdAsync(id);
            if (student == null) return NotFound();
            return Ok(student);
        }

        // Öğrenci kendi bilgilerini görsün
        [HttpGet("me")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyInfo()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var student = await _studentService.GetByIdAsync(userId);
            if (student == null) return NotFound();
            return Ok(student);
        }

        // Admin & Teacher yeni öğrenci ekleyebilir
        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Create(CreateStudentDto dto)
        {
            var created = await _studentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // Admin & Teacher güncelleyebilir
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Update(int id, CreateStudentDto dto)
        {
            var updated = await _studentService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

                // Admin & Teacher silebilir
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _studentService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // Teacher: Derse göre öğrencileri getir
        [HttpGet("by-class/{classId}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetStudentsByClassId(int classId)
        {
            var students = await _studentService.GetStudentsByClassIdAsync(classId);
            return Ok(students);
        }
    }
}

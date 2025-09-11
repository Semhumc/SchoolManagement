using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.DTOs;
using SchoolManagement.Services;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
        private readonly TeacherService _teacherService;

        public TeachersController(TeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        // Tüm öğretmenler
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var teachers = await _teacherService.GetAllAsync();
                return Ok(teachers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Öğretmenler yüklenirken hata oluştu", error = ex.Message });
            }
        }

        // Tek öğretmen
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var teacher = await _teacherService.GetByIdAsync(id);
                if (teacher == null) return NotFound();
                return Ok(teacher);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Öğretmen yüklenirken hata oluştu", error = ex.Message });
            }
        }

        // Yeni öğretmen ekle
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateTeacherDto dto)
        {
            try
            {
                var created = await _teacherService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Öğretmen oluşturulurken hata oluştu", error = ex.Message });
            }
        }

        // Güncelle
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, CreateTeacherDto dto)
        {
            try
            {
                var updated = await _teacherService.UpdateAsync(id, dto);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Öğretmen güncellenirken hata oluştu", error = ex.Message });
            }
        }

        // Sil
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _teacherService.DeleteAsync(id);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Öğretmen silinirken hata oluştu", error = ex.Message });
            }
        }
    }
}
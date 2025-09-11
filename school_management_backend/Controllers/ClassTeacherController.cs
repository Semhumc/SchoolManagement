using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Services;
using System.Security.Claims;

namespace SchoolManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Teacher")]
    public class ClassTeacherController : ControllerBase
    {
        private readonly ClassTeacherService _classTeacherService;

        public ClassTeacherController(ClassTeacherService classTeacherService)
        {
            _classTeacherService = classTeacherService;
        }

        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            var teacherId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var classes = await _classTeacherService.GetClassesByTeacher(teacherId);
            return Ok(classes);
        }
    }
}

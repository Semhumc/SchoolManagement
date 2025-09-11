using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.DTOs
{
    public class AdminCreateTeacherDto
    {
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        public string? Phone { get; set; }
        
        // Öğretmenin vereceği derslerin ID'leri
        public List<int>? ClassIds { get; set; }
    }

    public class AdminCreateStudentDto
    {
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        public string? Phone { get; set; }

        // Öğrencinin alacağı derslerin ID'leri
        public List<int>? ClassIds { get; set; }
    }
}

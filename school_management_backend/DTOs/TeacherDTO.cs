namespace SchoolManagement.DTOs
{
    public class TeacherDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string Role { get; set; } = "Teacher";
    }

    public class CreateTeacherDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; // şimdilik hash yok
        public string? Phone { get; set; }
    }
}

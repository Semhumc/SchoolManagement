namespace SchoolManagement.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? Phone { get; set; }

        // FK
        public int RoleId { get; set; }
        public RoleEnum Role { get; set; }

        // Navigation properties
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<Score> Scores { get; set; } = new List<Score>();
        public ICollection<ClassSchedule> ClassSchedules { get; set; } = new List<ClassSchedule>();
        public ICollection<ClassTeacher> ClassTeachers { get; set; } = new List<ClassTeacher>();
        public ICollection<ClassStudent> ClassStudents { get; set; } = new List<ClassStudent>();
    }
}
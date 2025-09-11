namespace SchoolManagement.Entities
{
    public class Class
    {
        public int Id { get; set; }
        public string ClassName { get; set; } = null!;

        public ICollection<ClassTeacher> ClassTeachers { get; set; } = new List<ClassTeacher>();
        public ICollection<ClassStudent> ClassStudents { get; set; } = new List<ClassStudent>();
        public ICollection<ClassSchedule> ClassSchedules { get; set; } = new List<ClassSchedule>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Score> Scores { get; set; } = new List<Score>();
    }
}

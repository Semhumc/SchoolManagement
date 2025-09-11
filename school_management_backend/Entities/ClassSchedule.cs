namespace SchoolManagement.Entities
{
    public class ClassSchedule
    {
        public int Id { get; set; }

        public int ClassTeacherId { get; set; }
        public ClassTeacher ClassTeacher { get; set; } = null!;

        public DateTime Date { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
    }
}

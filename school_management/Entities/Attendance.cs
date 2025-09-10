namespace SchoolManagement.Entities
{
    public class Attendance
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        public int ClassScheduleId { get; set; }
        public ClassSchedule ClassSchedule { get; set; } = null!;

        public bool IsPresent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

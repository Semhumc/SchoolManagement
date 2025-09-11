namespace SchoolManagement.Entities
{
    public class ClassManagement
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        public int ClassScheduleId { get; set; }
        public ClassSchedule ClassSchedule { get; set; } = null!;

        public int StatusId { get; set; }
        public StatusEnum Status { get; set; } 
    }
}

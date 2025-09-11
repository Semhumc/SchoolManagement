namespace SchoolManagement.DTOs
{
    public class CreateClassScheduleDto
    {
        public int ClassId { get; set; }
        public int TeacherId { get; set; }
        public DateTime ScheduleDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
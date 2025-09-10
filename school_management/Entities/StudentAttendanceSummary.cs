namespace SchoolManagement.Entities
{
    public class StudentAttendanceSummary
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public int AbsentCount { get; set; } = 0;   
    }
}

namespace SchoolManagement.DTOs
{
    public class CreateAttendanceDto
    {
        public int StudentId { get; set; }
        public int ClassScheduleId { get; set; }
        public bool IsPresent { get; set; } // true = geldi, false = gelmedi
    }


    public class AttendanceDto
    {
        public int Id { get; set; }
        public string StudentName { get; set; } = null!;
        public string ClassName { get; set; } = null!;
        public DateTime Date { get; set; }
        public bool IsPresent { get; set; }

    }
}

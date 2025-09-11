
namespace SchoolManagement.DTOs
{
    public class ClassScheduleDto
    {
        public int ClassScheduleId { get; set; } // Backend'de bu isim kullanılıyor
        public int ClassId { get; set; }
        public string ClassName { get; set; } = null!;
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public DateTime ScheduleDate { get; set; }
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
    }
}
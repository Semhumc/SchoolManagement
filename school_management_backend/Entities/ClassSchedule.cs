using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagement.Entities
{
    public class ClassSchedule
    {
        [Key]
        public int ClassScheduleId { get; set; }

        [Required]
        public int ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class? Class { get; set; }

        [Required]
        public int TeacherId { get; set; }
        [ForeignKey("TeacherId")]
        public User? Teacher { get; set; } // Assuming User entity represents teachers

        [Required]
        public DateTime ScheduleDate { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        // Navigation properties
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}
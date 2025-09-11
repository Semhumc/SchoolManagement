using System.ComponentModel.DataAnnotations.Schema;

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

        // Navigation properties for ClassManagement
        public int ClassId { get; set; } // Foreign key for Class
        [ForeignKey("ClassId")]
        public Class? Class { get; set; }

        public int TeacherId { get; set; } // Foreign key for Teacher (User)
        [ForeignKey("TeacherId")]
        public User? Teacher { get; set; } 
    }
}

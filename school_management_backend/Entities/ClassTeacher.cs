namespace SchoolManagement.Entities
{
    public class ClassTeacher
    {
        // Id field'ını kaldır, composite key kullan
        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public int TeacherId { get; set; }
        public User Teacher { get; set; } = null!;
    }
}

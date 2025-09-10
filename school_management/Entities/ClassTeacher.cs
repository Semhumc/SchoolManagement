namespace SchoolManagement.Entities
{
    public class ClassTeacher
    {
     public int Id { get; set; }

        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public int TeacherId { get; set; }
        public User Teacher { get; set; } = null!;
    }
}

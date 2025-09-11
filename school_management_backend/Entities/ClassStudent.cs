namespace SchoolManagement.Entities
{
    public class ClassStudent
    {
        public int Id { get; set; }

        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;
    }
}

namespace SchoolManagement.Entities
{
    public class Score
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        public int TeacherId { get; set; }
        public User Teacher { get; set; } = null!;

        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public decimal Value { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

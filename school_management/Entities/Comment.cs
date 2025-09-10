namespace SchoolManagement.Entities
{
    public class Comment
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;

        public int TeacherId { get; set; }
        public User Teacher { get; set; } = null!;

        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public string CommentText { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

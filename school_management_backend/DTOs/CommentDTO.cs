namespace SchoolManagement.DTOs
{
    public class CreateCommentDto
    {
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public string CommentText { get; set; } = null!;
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public string StudentName { get; set; } = null!;
        public string TeacherName { get; set; } = null!;
        public string ClassName { get; set; } = null!;
        public string CommentText { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    
}

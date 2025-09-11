namespace SchoolManagement.DTOs
{
    public class CreateScoreDto
    {
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public int Value { get; set; } // 0-100
    }

    public class ScoreDto
    {
        public int Id { get; set; }
        public string StudentName { get; set; } = null!;
        public string TeacherName { get; set; } = null!;
        public string ClassName { get; set; } = null!;
        public int Value { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

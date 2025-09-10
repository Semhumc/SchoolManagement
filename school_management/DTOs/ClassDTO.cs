namespace SchoolManagement.DTOs
{
    public class ClassDto
    {
       
        public int Id { get; set; }
        public string ClassName { get; set; } = null!;
        public List<string> Teachers { get; set; } = new();
        public List<string> Students { get; set; } = new();

    }

    public class CreateClassDto
    {
        public string ClassName { get; set; } = null!;

    }

    public class UpdateClassStatusDto
    {
        public string Status { get; set; } = null!; 
    }
}
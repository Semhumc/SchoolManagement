// ClassStudent.cs - Düzeltilmiş  
namespace SchoolManagement.Entities
{
    public class ClassStudent
    {
        // Id field'ını kaldır, composite key kullan
        public int ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public int StudentId { get; set; }
        public User Student { get; set; } = null!;
    }
}

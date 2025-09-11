namespace SchoolManagement.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? Phone { get; set; }

        // FK
        public int RoleId { get; set; }
        public RoleEnum Role { get; set; }
    }
}
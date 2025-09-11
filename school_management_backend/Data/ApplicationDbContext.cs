using Microsoft.EntityFrameworkCore;
using SchoolManagement.Entities;

namespace SchoolManagement.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<ClassTeacher> ClassTeachers { get; set; }
        public DbSet<ClassStudent> ClassStudents { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Score> Scores { get; set; }
        public DbSet<ClassSchedule> ClassSchedules { get; set; }
        public DbSet<ClassManagement> ClassManagements { get; set; }

        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<StudentAttendanceSummary> StudentAttendanceSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<int>();

            modelBuilder.Entity<ClassManagement>()
                .Property(c => c.Status)
                .HasConversion<int>();
        }
    }
}

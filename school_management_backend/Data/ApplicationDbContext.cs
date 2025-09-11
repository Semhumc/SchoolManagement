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

            // User and ClassTeacher (Many-to-Many)
            modelBuilder.Entity<ClassTeacher>()
                .HasKey(ct => new { ct.ClassId, ct.TeacherId });
            modelBuilder.Entity<ClassTeacher>()
                .HasOne(ct => ct.Class)
                .WithMany(c => c.ClassTeachers)
                .HasForeignKey(ct => ct.ClassId);
            modelBuilder.Entity<ClassTeacher>()
                .HasOne(ct => ct.Teacher)
                .WithMany(t => t.ClassTeachers)
                .HasForeignKey(ct => ct.TeacherId);

            // User and ClassStudent (Many-to-Many)
            modelBuilder.Entity<ClassStudent>()
                .HasKey(cs => new { cs.ClassId, cs.StudentId });
            modelBuilder.Entity<ClassStudent>()
                .HasOne(cs => cs.Class)
                .WithMany(c => c.ClassStudents)
                .HasForeignKey(cs => cs.ClassId);
            modelBuilder.Entity<ClassStudent>()
                .HasOne(cs => cs.Student)
                .WithMany(s => s.ClassStudents)
                .HasForeignKey(cs => cs.StudentId);

            // ClassSchedule and Class (One-to-Many)
            modelBuilder.Entity<ClassSchedule>()
                .HasOne(cs => cs.Class)
                .WithMany(c => c.ClassSchedules) // Assuming Class has a ClassSchedules collection
                .HasForeignKey(cs => cs.ClassId);

            // ClassSchedule and User (Teacher) (One-to-Many)
            modelBuilder.Entity<ClassSchedule>()
                .HasOne(cs => cs.Teacher)
                .WithMany(u => u.ClassSchedules) // User now has ClassSchedules collection
                .HasForeignKey(cs => cs.TeacherId);

            // Attendance and ClassSchedule (One-to-Many)
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.ClassSchedule)
                .WithMany(cs => cs.Attendances) // ClassSchedule now has Attendances collection
                .HasForeignKey(a => a.ClassScheduleId);

            // Attendance and User (Student) (One-to-Many)
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany(u => u.Attendances) // User now has Attendances collection
                .HasForeignKey(a => a.StudentId);

            // Comment and Class (One-to-Many)
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Class)
                .WithMany(cl => cl.Comments)
                .HasForeignKey(c => c.ClassId);

            // Score and Class (One-to-Many)
            modelBuilder.Entity<Score>()
                .HasOne(s => s.Class)
                .WithMany(cl => cl.Scores)
                .HasForeignKey(s => s.ClassId);

            // Score and User (Student) (One-to-Many)
            modelBuilder.Entity<Score>()
                .HasOne(s => s.Student)
                .WithMany(u => u.Scores) // User now has Scores collection
                .HasForeignKey(s => s.StudentId);

            // ClassManagement and Class (One-to-Many)
            modelBuilder.Entity<ClassManagement>()
                .HasOne(cm => cm.Class)
                .WithMany() // Assuming Class does not have a ClassManagements collection
                .HasForeignKey(cm => cm.ClassId);

            // ClassManagement and User (Teacher) (One-to-Many)
            modelBuilder.Entity<ClassManagement>()
                .HasOne(cm => cm.Teacher)
                .WithMany() // Assuming User does not have a ClassManagements collection
                .HasForeignKey(cm => cm.TeacherId);

            // Enum conversions
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<int>();

            modelBuilder.Entity<ClassManagement>()
                .Property(c => c.Status)
                .HasConversion<int>();
        }
    }
}

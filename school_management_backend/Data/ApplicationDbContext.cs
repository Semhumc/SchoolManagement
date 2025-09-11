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

            // ClassTeacher - Composite key düzeltmesi
            modelBuilder.Entity<ClassTeacher>()
                .HasKey(ct => new { ct.ClassId, ct.TeacherId });

            modelBuilder.Entity<ClassTeacher>()
                .HasOne(ct => ct.Class)
                .WithMany(c => c.ClassTeachers)
                .HasForeignKey(ct => ct.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClassTeacher>()
                .HasOne(ct => ct.Teacher)
                .WithMany(t => t.ClassTeachers)
                .HasForeignKey(ct => ct.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            // ClassStudent - Composite key düzeltmesi
            modelBuilder.Entity<ClassStudent>()
                .HasKey(cs => new { cs.ClassId, cs.StudentId });

            modelBuilder.Entity<ClassStudent>()
                .HasOne(cs => cs.Class)
                .WithMany(c => c.ClassStudents)
                .HasForeignKey(cs => cs.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClassStudent>()
                .HasOne(cs => cs.Student)
                .WithMany(s => s.ClassStudents)
                .HasForeignKey(cs => cs.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // ClassSchedule ilişkileri
            modelBuilder.Entity<ClassSchedule>()
                .HasOne(cs => cs.Class)
                .WithMany(c => c.ClassSchedules)
                .HasForeignKey(cs => cs.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClassSchedule>()
                .HasOne(cs => cs.Teacher)
                .WithMany(u => u.ClassSchedules)
                .HasForeignKey(cs => cs.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            // Attendance ilişkileri
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.ClassSchedule)
                .WithMany(cs => cs.Attendances)
                .HasForeignKey(a => a.ClassScheduleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany(u => u.Attendances)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment ilişkileri düzeltmesi
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Student)
                .WithMany() // User'da Comments collection'ı olmadığı için
                .HasForeignKey(c => c.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Teacher)
                .WithMany()
                .HasForeignKey(c => c.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Class)
                .WithMany(cl => cl.Comments)
                .HasForeignKey(c => c.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            // Score ilişkileri
            modelBuilder.Entity<Score>()
                .HasOne(s => s.Student)
                .WithMany(u => u.Scores)
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Score>()
                .HasOne(s => s.Teacher)
                .WithMany()
                .HasForeignKey(s => s.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Score>()
                .HasOne(s => s.Class)
                .WithMany(cl => cl.Scores)
                .HasForeignKey(s => s.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

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

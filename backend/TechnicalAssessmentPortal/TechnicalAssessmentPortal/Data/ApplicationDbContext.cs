using Microsoft.EntityFrameworkCore;
using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<UserQuizResult> UserQuizResults { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }

        public DbSet<Option> Options { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        public DbSet<UserSubjectPerformance> UserSubjectPerformances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserAnswer
            modelBuilder.Entity<UserAnswer>()
                .HasOne(ua => ua.Question)
                .WithMany()
                .HasForeignKey(ua => ua.QuestionId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserAnswer>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.Answers)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Option
            modelBuilder.Entity<Option>()
                .HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Question → Subject
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Subject)
                .WithMany(s => s.Questions)
                .HasForeignKey(q => q.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            // QuizResult
            modelBuilder.Entity<UserQuizResult>()
                .HasOne(r => r.User)
                .WithMany(u => u.QuizResults)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }

    }
}
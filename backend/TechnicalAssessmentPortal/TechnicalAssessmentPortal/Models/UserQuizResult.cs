namespace TechnicalAssessmentPortal.Models
{
    public class UserQuizResult
    {
        public int Id { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int SubmittedCount { get; set; }
        public int SkippedCount { get; set; }

        public int TimeTaken { get; set; }

        public int Score { get; set; }

        public DateTime AttemptedOn { get; set; } = DateTime.UtcNow;

        public ICollection<UserSubjectPerformance>? TopicPerformance { get; set; }
    }
}

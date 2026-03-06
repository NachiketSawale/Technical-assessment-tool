namespace TechnicalAssessmentPortal.Models
{
    public class UserSubjectPerformance
    {
        public int Id { get; set; }

        public int UserQuizResultId { get; set; }
        public UserQuizResult? QuizResult { get; set; }

        public int SubjectId { get; set; }
        public Subject? Subject { get; set; }

        public int TotalQuestions { get; set; }

        public int CorrectAnswers { get; set; }

        public double AccuracyPercentage { get; set; }
    }
}

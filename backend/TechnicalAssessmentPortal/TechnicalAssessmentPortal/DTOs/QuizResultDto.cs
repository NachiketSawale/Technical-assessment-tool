namespace TechnicalAssessmentPortal.DTOs
{
    public class QuizResultDto
    {
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int Score { get; set; }
        public int SubmittedCount { get; set; }

        public int SkippedCount { get; set; }
        public int TimeTaken { get; set; }
      //  public string? AIRecommendation { get; set; }

    }
}

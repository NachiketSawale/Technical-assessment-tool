namespace TechnicalAssessmentPortal.DTOs
{
    public class SubmitQuizDto
    {
        public List<UserAnswerDto>? Answers { get; set; } 
        public int TimeTaken { get; set; }
    }

    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public List<int> SelectedOptionIds { get; set; } = new();
    }

}

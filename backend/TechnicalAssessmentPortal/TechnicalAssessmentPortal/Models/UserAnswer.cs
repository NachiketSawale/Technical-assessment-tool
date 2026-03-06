namespace TechnicalAssessmentPortal.Models
{
    public class UserAnswer
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int QuestionId { get; set; }

        public int OptionId { get; set; }   // ✅ selected option

        public bool IsCorrect { get; set; }

        public User? User { get; set; }

        public Question? Question { get; set; }

        public Option? Option { get; set; }

    }
}

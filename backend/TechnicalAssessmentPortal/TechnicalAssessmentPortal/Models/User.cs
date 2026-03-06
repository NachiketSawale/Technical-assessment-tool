using System.ComponentModel.DataAnnotations;

namespace TechnicalAssessmentPortal.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int TotalScore { get; set; }

        public bool IsFirstTimeLogin { get; set; }

        public ICollection<UserQuizResult>? QuizResults { get; set; }

        public ICollection<UserAnswer>? Answers { get; set; }
    }
}

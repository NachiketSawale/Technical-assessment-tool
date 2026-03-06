

using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.DTOs
{
    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public int? SelectedOption { get; set; }   // nullable — null means the question was skipped
    }
}

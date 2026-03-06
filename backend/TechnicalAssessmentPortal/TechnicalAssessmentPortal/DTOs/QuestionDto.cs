namespace TechnicalAssessmentPortal.DTOs
{
    namespace TechnicalAssessmentPortal.DTOs
    {
        public class QuestionDto
        {
            public int Id { get; set; }

            public string QuestionText { get; set; } = string.Empty;

            public bool IsMultipleAnswer { get; set; }

            public string SubjectName { get; set; } = string.Empty;

            public List<OptionDto> Options { get; set; } = new();
        }
    }
}

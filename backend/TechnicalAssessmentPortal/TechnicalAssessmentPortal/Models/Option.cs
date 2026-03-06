using System.Text.Json.Serialization;

namespace TechnicalAssessmentPortal.Models
{
    public class Option
    {
        public int Id { get; set; }

        public int QuestionId { get; set; }

        public string OptionText { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }   // ✅ supports multiple answers

        [JsonIgnore]
        public Question? Question { get; set; }
    }
}

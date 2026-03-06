


using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TechnicalAssessmentPortal.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }

        public string QuestionText { get; set; } = string.Empty;

        public int SubjectId { get; set; }
        public Subject? Subject { get; set; }

        public bool IsMultipleAnswer { get; set; }   // checkbox support

        public bool IsLive { get; set; }

        public ICollection<Option>? Options { get; set; }
    }
}

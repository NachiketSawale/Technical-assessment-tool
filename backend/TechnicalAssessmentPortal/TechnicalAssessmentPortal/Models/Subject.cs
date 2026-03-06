namespace TechnicalAssessmentPortal.Models
{
    public class Subject
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ICollection<Question>? Questions { get; set; }
    }
}

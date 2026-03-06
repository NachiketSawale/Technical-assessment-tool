using System.ComponentModel.DataAnnotations;

namespace TechnicalAssessmentPortal.DTOs
{
    public class LoginRequestDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
    }
}

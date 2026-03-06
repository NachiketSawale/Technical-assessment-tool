using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}

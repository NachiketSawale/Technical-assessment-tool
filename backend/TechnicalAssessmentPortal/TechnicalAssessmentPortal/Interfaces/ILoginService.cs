using TechnicalAssessmentPortal.DTOs;

namespace TechnicalAssessmentPortal.Interfaces
{
    public interface ILoginService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    }
}

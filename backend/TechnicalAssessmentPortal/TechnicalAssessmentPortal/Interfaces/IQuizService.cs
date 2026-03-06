using TechnicalAssessmentPortal.DTOs;

namespace TechnicalAssessmentPortal.Interfaces
{
    public interface IQuizService
    {
        Task<QuizResultDto> SubmitQuizAsync(int? userId, SubmitQuizDto? dto);
     //   Task<QuizResultDto> SubmitQuizJson(int? userId, SubmitQuizDto? dto);
    }
}

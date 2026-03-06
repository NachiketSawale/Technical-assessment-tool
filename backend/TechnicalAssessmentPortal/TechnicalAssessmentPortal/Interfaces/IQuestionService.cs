using TechnicalAssessmentPortal.DTOs.TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Interfaces
{
    public interface IQuestionService
    {
        Task<List<QuestionDto>> GetLiveQuestionsAsync();
        //Task<QuestionDetails> GetQuestionByIdAsync(int id);
        //Task AddQuestionAsync(QuestionDetails question);
        //Task UpdateQuestionAsync(QuestionDetails question);
        //Task DeleteQuestionAsync(int id);
    }
}

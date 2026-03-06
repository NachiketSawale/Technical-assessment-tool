using Microsoft.EntityFrameworkCore;
using TechnicalAssessmentPortal.Data;
using TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.DTOs.TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.Interfaces;
using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly ApplicationDbContext _context;

        public QuestionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<QuestionDto>> GetLiveQuestionsAsync()
        {
            var questions = await _context.Questions
                .Where(q => q.IsLive)
                .Include(q => q.Options)
                .Include(q => q.Subject)
                .AsNoTracking()
                .ToListAsync();

            // ✅ DTO Mapping happens HERE
            var questionDtos = questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                IsMultipleAnswer = q.IsMultipleAnswer,
                SubjectName = q.Subject!.Name,
                Options = q.Options!.Select(o => new OptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText
                }).ToList()
            }).ToList();

            return questionDtos;
        }
    }
}
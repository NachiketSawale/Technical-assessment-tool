using Microsoft.EntityFrameworkCore;
using TechnicalAssessmentPortal.Data;
using TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.Interfaces;
using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Services
{
    public class QuizService : IQuizService
    {
        private readonly ApplicationDbContext _context;
       

        public QuizService(ApplicationDbContext context)
        {
            _context = context;
         
        }

        public async Task<QuizResultDto> SubmitQuizAsync(int? userId, SubmitQuizDto dto)
        {
            if (userId == null)
                throw new ArgumentNullException(nameof(userId));

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            var questionIds = dto.Answers
                .Select(a => a.QuestionId)
                .ToList();

            var questions = await _context.Questions
                .Include(q => q.Options)
                .Include(q => q.Subject)
                .Where(q => questionIds.Contains(q.Id))
                .ToListAsync();

            int correctCount = 0;

            var subjectStats = new Dictionary<int, (int total, int correct)>();

            foreach (var answer in dto.Answers)
            {
                var question = questions
                    .FirstOrDefault(q => q.Id == answer.QuestionId);

                if (question == null)
                    continue;

                var correctOptionIds = question.Options
                    .Where(o => o.IsCorrect)
                    .Select(o => o.Id)
                    .OrderBy(x => x)
                    .ToList();

                var selectedIds = answer.SelectedOptionIds
                    .OrderBy(x => x)
                    .ToList();

                bool isCorrect =
                    correctOptionIds.SequenceEqual(selectedIds);

                if (isCorrect)
                    correctCount++;

                // ✅ Save User Answers
                foreach (var optionId in selectedIds)
                {
                    _context.UserAnswers.Add(new UserAnswer
                    {
                        UserId = userId.Value,
                        QuestionId = question.Id,
                        OptionId = optionId,
                        IsCorrect = correctOptionIds.Contains(optionId)
                    });
                }

                // ✅ Subject-wise calculation
                int subjectId = question.SubjectId;

                if (!subjectStats.ContainsKey(subjectId))
                    subjectStats[subjectId] = (0, 0);

                var stat = subjectStats[subjectId];

                stat.total++;

                if (isCorrect)
                    stat.correct++;

                subjectStats[subjectId] = stat;
            }

            int totalQuestions = questions.Count;
            int attempted = dto.Answers.Count(a => a.SelectedOptionIds.Any());
            int skipped = totalQuestions - attempted;
            int score = correctCount * 10;

            var result = new UserQuizResult
            {
                UserId = userId,
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctCount,
                SubmittedCount = attempted,
                SkippedCount = skipped,
                Score = score,
                TimeTaken = dto.TimeTaken
            };

            _context.UserQuizResults.Add(result);
            await _context.SaveChangesAsync();

            // ✅ SUBJECT PERFORMANCE SAVE
            foreach (var item in subjectStats)
            {
                var accuracy =
                    (double)item.Value.correct / item.Value.total * 100;

                _context.UserSubjectPerformances.Add(
                    new UserSubjectPerformance
                    {
                        UserQuizResultId = result.Id,
                        SubjectId = item.Key,
                        TotalQuestions = item.Value.total,
                        CorrectAnswers = item.Value.correct,
                        AccuracyPercentage = accuracy
                    });
            }

            var subjectPerformanceForAI = await _context.UserSubjectPerformances
                .Include(s => s.Subject)
                .Where(s => s.UserQuizResultId == result.Id)
                .Select(s => new
                {
                    SubjectName = s.Subject.Name,
                    Accuracy = s.AccuracyPercentage
                })
                .ToListAsync();

            var aiSubjects = subjectPerformanceForAI
                .Select(s => (s.SubjectName, s.Accuracy))
                .ToList();

          //  user.IsFirstTimeLogin = true;
            user.TotalScore = result.Score;
            await _context.SaveChangesAsync();

            return new QuizResultDto
            {
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctCount,
                Score = score,
                SubmittedCount = attempted,
                SkippedCount = skipped,
                TimeTaken = dto.TimeTaken,
              //  AIRecommendation = aiRecommendation
            };
        }
    }
}
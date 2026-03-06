using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TechnicalAssessmentPortal.Interfaces;
using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService _question)
        {
            _questionService = _question;
        }

        [HttpGet("live")]
        public async Task<IActionResult> GetLiveQuestions()
        {
            var questions = await _questionService.GetLiveQuestionsAsync();
            return Ok(questions);
        }


        //[HttpGet("json")]
        //public IActionResult GetQuestions()
        //{
        //    var filePath = Path.Combine(
        //        Directory.GetCurrentDirectory(),
        //        "wwwroot",
        //        "questions.json");

        //    var json = System.IO.File.ReadAllText(filePath);

        //    var questions = JsonSerializer.Deserialize<List<QuestionDetails>>(
        //        json,
        //        new JsonSerializerOptions
        //        {
        //            PropertyNameCaseInsensitive = true
        //        });


        //    var safeQuestions = questions.Select(q => new
        //    {
        //        q.Id,
        //        q.QuestionText,
        //        q.Options
        //    });

        //    return Ok(safeQuestions);
        //}

    }
}

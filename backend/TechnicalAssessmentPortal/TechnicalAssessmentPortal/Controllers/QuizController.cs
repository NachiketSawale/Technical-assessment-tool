using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.Interfaces;

namespace TechnicalAssessmentPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }
        [Authorize]
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitQuiz(SubmitQuizDto dto)
        {
        
              var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
              
            if (userId == null)
            {
                return Unauthorized();
            }
            var result = await _quizService.SubmitQuizAsync(userId, dto);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpPost("submitjson")]
        public async Task<IActionResult> SubmitQuizJson(SubmitQuizDto dto)
        {

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (userId == null)
            {
                return Unauthorized();
            }
            var result = await _quizService.SubmitQuizAsync(userId, dto);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}

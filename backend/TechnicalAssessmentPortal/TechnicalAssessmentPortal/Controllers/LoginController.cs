using Microsoft.AspNetCore.Mvc;
using TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TechnicalAssessmentPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
       private readonly ILoginService _loginService;
       public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var response = await _loginService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized("Invalid Username");
            }

            return Ok(response);
        }
    }
}

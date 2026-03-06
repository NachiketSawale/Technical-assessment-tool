using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using TechnicalAssessmentPortal.Data;
using TechnicalAssessmentPortal.DTOs;
using TechnicalAssessmentPortal.Interfaces;
using TechnicalAssessmentPortal.Models;

namespace TechnicalAssessmentPortal.Services
{
    public class LoginService : ILoginService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;

        public LoginService(ApplicationDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
          
            var user = await _context.Users
                .FirstOrDefaultAsync(x =>x.Email == request.Email && !x.IsFirstTimeLogin );

            if (user is null)
                throw new UnauthorizedAccessException("Invalid credentials.");
           

            var token = _jwtService.GenerateToken(user);

            return new LoginResponseDto
            {
                Username = user.Username,
                Token = token
            };
        }
    }



}

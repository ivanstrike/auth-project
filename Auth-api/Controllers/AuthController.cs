using Microsoft.AspNetCore.Mvc;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private static readonly byte[] Key = new byte[32]; 

    static AuthController()
    {
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(Key);
        }
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] UserCredentials credentials)
    {
        if (credentials.Username != null && credentials.Password != null && credentials.Username != "" &&  credentials.Password != "")
        {
            var accessToken = GenerateJwtToken(credentials.Username, TimeSpan.FromMinutes(15));
            var refreshToken = GenerateJwtToken(credentials.Username, TimeSpan.FromMinutes(7));

            return Ok(new { accessToken, refreshToken });
        }

        return Unauthorized();
    }

    
    private string GenerateJwtToken(string username, TimeSpan expiresIn)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.Name, username) }),
            Expires = DateTime.UtcNow.Add(expiresIn),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

}

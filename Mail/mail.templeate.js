export const verificationCodeTemplate = `
  <div style="background-color: #C6F4D6; padding: 20px; border-radius: 10px;">
    <h1 style="color: #4CAF50;">Hello {{ email }}</h1>
    <h2 style="color: #4CAF50;">Verification Code :</h2>
    <p>Your verification code is: <strong style="color: #4CAF50; font-weight: bold">{{ verificationCode }}</strong></p>
    <p style="color: #4CAF50;">This code is valid for {{ validityDate }} At {{ validityTime }}.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best,</p>
    <p>Your Team</p>
  </div>
`;

export const resetPasswordTemplate = `
  <div style="background-color: #C6F4D6; padding: 20px; border-radius: 10px; items-align: center; justify-content: center;">
    <h1 style="color: #4CAF50;">Hello {{ email }}</h1>
    <p style="color: #4CAF50;">You have requested a password reset.</p>
    <p style="color: #4CAF50;">To reset your password, please click the button below:</p>
    <p style="color: #4CAF50;">This token is valid for {{ validityDate }} At {{ validityTime }}.</p>
    <p style="color: #4CAF50;">If you did not request this, please ignore this email.</p>
    <a href="{{ resetUrl }}" style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 10px;">Click here to Reset Password</a>
    <p>Best ,</p>
    <p>Your Team</p>
  </div>
`;
export const resetPasswordSucessTemplate = `
  <div style="background-color: #C6F4D6;margin:40px 0px; padding: 20px; border-radius: 10px; items-align: center; justify-content: center;">
    <h1 style="color: #4CAF50;">Hello {{ email }}</h1>
    <p style="color: #4CAF50;">Your password has been successfully reset.</p>

     <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p style="color: #4CAF50;">If you did not request this, please ignore this email.</p>
    <p>Best ,</p>
    <p>Your Team</p>
  </div>
`;





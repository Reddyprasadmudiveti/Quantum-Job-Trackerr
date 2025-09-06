export const verificationCodeTemplate = `
  <div style="background: linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #831843 100%); padding: 30px; border-radius: 10px; color: white; font-family: Arial, sans-serif;">
    <h1 style="color: white; margin-bottom: 20px;">Hello {{ email }}</h1>
    <h2 style="color: white;">Verification Code:</h2>
    <div style="background-color: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 0; color: #10b981;">{{ verificationCode }}</p>
    </div>
    <p>This code is valid until {{ validityDate }} at {{ validityTime }}.</p>
    <p>If you did not request this, please ignore this email.</p>
    <div style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 20px;">
      <p>Best regards,</p>
      <p>Quantum Job Tracker Team</p>
    </div>
  </div>
`;

export const resetPasswordTemplate = `
  <div style="background: linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #831843 100%); padding: 30px; border-radius: 10px; color: white; font-family: Arial, sans-serif;">
    <h1 style="color: white; margin-bottom: 20px;">Hello {{ email }}</h1>
    <p>You have requested a password reset.</p>
    <p>To reset your password, please click the button below:</p>
    <p>This link is valid until {{ validityDate }} at {{ validityTime }}.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ resetUrl }}" style="background-color: #10b981; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">Reset Password</a>
    </div>
    <p>If you did not request this, please ignore this email.</p>
    <div style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 20px;">
      <p>Best regards,</p>
      <p>Quantum Job Tracker Team</p>
    </div>
  </div>
`;

export const resetPasswordSucessTemplate = `
  <div style="background: linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #831843 100%); padding: 30px; border-radius: 10px; color: white; font-family: Arial, sans-serif;">
    <h1 style="color: white; margin-bottom: 20px;">Hello {{ email }}</h1>
    <p>Your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #10b981; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>You can now log in with your new password. If you did not make this change, please contact our support team immediately.</p>
    <div style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 20px;">
      <p>Best regards,</p>
      <p>Quantum Job Tracker Team</p>
    </div>
  </div>
`;

export const courseEnrollmentTemplate = `
  <div style="background: linear-gradient(135deg, #312e81 0%, #6b21a8 50%, #831843 100%); padding: 30px; border-radius: 10px; color: white; font-family: Arial, sans-serif;">
    <h1 style="color: white; margin-bottom: 20px;">Hello {{ userName }}</h1>
    <p>Congratulations! You have successfully enrolled in the following course:</p>
    <div style="background-color: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(255, 255, 255, 0.1);">
      <h2 style="color: #10b981; margin-top: 0;">{{ courseTitle }}</h2>
      <p><strong>Instructor:</strong> {{ instructor }}</p>
      <p><strong>Duration:</strong> {{ duration }}</p>
      <p><strong>Level:</strong> {{ level }}</p>
    </div>
    <p>You can access your course materials by logging into your account.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ courseUrl }}" style="background-color: #10b981; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">Access Course</a>
    </div>
    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    <div style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 20px;">
      <p>Best regards,</p>
      <p>Quantum Job Tracker Team</p>
    </div>
  </div>
`;

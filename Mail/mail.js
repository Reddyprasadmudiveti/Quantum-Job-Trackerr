import { transporter } from "./mail.config.js";
import { resetPasswordSucessTemplate, resetPasswordTemplate, verificationCodeTemplate } from "./mail.templeate.js";
import dotenv from "dotenv";
import dns from 'dns';
import net from 'net';

dotenv.config();

// New function to verify email existence on SMTP server
export const verifyEmailSMTP = async (email) => {
  return new Promise(async (resolve) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resolve({
        valid: false,
        reason: 'invalid_format',
        message: 'Email format is invalid'
      });
    }

    // Extract domain from email
    const domain = email.split('@')[1];
    
    try {
      // Check if domain has MX records
      const mxRecords = await new Promise((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            resolve(addresses);
          }
        });
      });

      if (!mxRecords || mxRecords.length === 0) {
        return resolve({
          valid: false,
          reason: 'no_mx_records',
          message: 'Domain does not have MX records'
        });
      }

      // Sort MX records by priority (lowest first)
      mxRecords.sort((a, b) => a.priority - b.priority);
      
      // Try to connect to the SMTP server
      const smtpServer = mxRecords[0].exchange;
      const socket = net.createConnection(25, smtpServer);
      let responseBuffer = '';
      let step = 0;
      let timeout;
      
      // Set timeout for the entire verification process
      timeout = setTimeout(() => {
        socket.destroy();
        return resolve({
          valid: false,
          reason: 'timeout',
          message: 'SMTP verification timed out'
        });
      }, 10000); // 10 seconds timeout
      
      socket.on('data', (data) => {
        responseBuffer += data.toString();
        
        // Process based on the current step
        if (responseBuffer.includes('220') && step === 0) {
          // Send HELO command
          socket.write(`HELO mail.example.org\r\n`);
          step = 1;
          responseBuffer = '';
        } else if (responseBuffer.includes('250') && step === 1) {
          // Send MAIL FROM command
          socket.write(`MAIL FROM:<verify@example.org>\r\n`);
          step = 2;
          responseBuffer = '';
        } else if (responseBuffer.includes('250') && step === 2) {
          // Send RCPT TO command with the email to verify
          socket.write(`RCPT TO:<${email}>\r\n`);
          step = 3;
          responseBuffer = '';
        } else if (step === 3) {
          // Check the response to RCPT TO command
          if (responseBuffer.includes('250')) {
            // Email exists
            clearTimeout(timeout);
            socket.write('QUIT\r\n');
            socket.end();
            return resolve({
              valid: true,
              reason: 'smtp_valid',
              message: 'Email address exists on the mail server'
            });
          } else if (responseBuffer.includes('550') || responseBuffer.includes('553') || responseBuffer.includes('554')) {
            // Email doesn't exist
            clearTimeout(timeout);
            socket.write('QUIT\r\n');
            socket.end();
            return resolve({
              valid: false,
              reason: 'smtp_invalid',
              message: 'Email address does not exist on the mail server'
            });
          } else if (responseBuffer.includes('450') || responseBuffer.includes('451') || responseBuffer.includes('452')) {
            // Temporary error or greylisting
            clearTimeout(timeout);
            socket.write('QUIT\r\n');
            socket.end();
            return resolve({
              valid: true, // Assume valid in case of temporary errors
              reason: 'greylisted',
              message: 'Mail server returned a temporary error (possibly greylisting)'
            });
          }
        }
      });
      
      socket.on('error', (err) => {
        clearTimeout(timeout);
        return resolve({
          valid: false,
          reason: 'connection_error',
          message: `SMTP connection error: ${err.message}`
        });
      });
      
      socket.on('end', () => {
        clearTimeout(timeout);
      });
      
    } catch (error) {
      return resolve({
        valid: false,
        reason: 'dns_error',
        message: `DNS resolution error: ${error.message}`
      });
    }
  });
};

export const verificationMail = async (email, token, expiryDate,expiryTime) => {
    // First verify if the email exists on the mail server
    const verification = await verifyEmailSMTP(email);
    
    // If email is not valid, throw an error
    if (!verification.valid) {
      console.error("Email verification failed:", verification.message);
      throw new Error(`Email verification failed: ${verification.message}`);
    }

    const username=email.split('@')[0].replace(/[0-9]/g, '')
    console.log("email", email, "token", token);

    try {
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        Headers: "Content-Type: text/html",
        Category: "Verification",
        subject: "Verification Code",
        html: verificationCodeTemplate.replace(
          "{{ verificationCode }}",
          token
        ).replace(
          "{{ email }}",
          username
        ).replace(
          "{{ validityDate }}",
          expiryDate
        ).replace(
          "{{ validityTime }}",
          expiryTime
        )
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return info;

    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
};

// Update forgotPasswordMail to use SMTP verification
export const forgotPasswordMail=async(mail,url,validityDate,validityTime)=>{
    // First verify if the email exists on the mail server
    const verification = await verifyEmailSMTP(mail);
    
    // If email is not valid, throw an error
    if (!verification.valid) {
      console.error("Email verification failed:", verification.message);
      throw new Error(`Email verification failed: ${verification.message}`);
    }
    
    const sender = process.env.MAIL_USER;
    const UserName=mail.split("@")[0].replace(/[0-9]/g,"")

    try {
        const mailOptions={
            from:sender,
            to:mail,
            Headers:"Content-Type: text/html",
            Category:"Reset Password ",
            subject:"Reset Password",
            html:resetPasswordTemplate.replace("{{ email }}",UserName).replace("{{ validityDate }}",validityDate ).replace("{{ validityTime }}",validityTime).replace("{{ resetUrl }}",url)
        }

        const info=await transporter.sendMail(mailOptions)
        console.log("Email sent",info.response)
        return info
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}

// Update resetPasswordMail to use SMTP verification
export const resetPasswordMail=async(mail)=>{
    // First verify if the email exists on the mail server
    const verification = await verifyEmailSMTP(mail);
    
    // If email is not valid, throw an error
    if (!verification.valid) {
      console.error("Email verification failed:", verification.message);
      throw new Error(`Email verification failed: ${verification.message}`);
    }
    
    const sender = process.env.MAIL_USER;
    const UserName=mail.split("@")[0].replace(/[0-9]/g,"")

    try {
        const mailOptions={
            from:sender,
            to:mail,
            Headers:"Content-Type: text/html",
            Category:"reset Password successful ",
            subject:"reset Password successful",
            html:resetPasswordSucessTemplate.replace("{{ email }}",UserName)
        }

        const info=await transporter.sendMail(mailOptions)
        console.log("Email sent",info.response)
        return info
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}
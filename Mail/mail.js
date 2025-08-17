import { transporter } from "./mail.config.js";
import { resetPasswordSucessTemplate, resetPasswordTemplate, verificationCodeTemplate } from "./mail.templeate.js";
import dotenv from "dotenv";

dotenv.config();

export const verificationMail = async (email, token, expiryDate,expiryTime) => {

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


export const forgotPasswordMail=async(mail,url,validityDate,validityTime)=>{
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
    }

}
export const resetPasswordMail=async(mail)=>{
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
    }

}
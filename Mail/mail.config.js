import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

console.log("process.env.MAIL_USER",process.env.MAIL_USER)

export const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAIL_USER,// senders email address
        pass: process.env.MAIL_PASS // senders password
    }
})

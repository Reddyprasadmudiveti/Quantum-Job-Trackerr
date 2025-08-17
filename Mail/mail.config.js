import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });

export const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS 
    }
})

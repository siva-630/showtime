
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || process.env.SMPT_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendEmail = async ({to,subject,body})=>{
    try {
        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body,
        })
        return response
    } catch (err) {
        console.error('sendEmail error:', err && err.message ? err.message : err)
        throw err
    }
}
const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log('SMTP transporter verified');
        return true;
    } catch (err) {
        console.error('SMTP transporter verification failed:', err && err.message ? err.message : err);
        return false;
    }
}

export { verifyTransporter }
export default sendEmail
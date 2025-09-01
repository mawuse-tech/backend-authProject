import nodemailer from 'nodemailer'

export const sendMail = async (Option) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Vogue IT Support<vogue@div>',
        to: Option.email,
        subject: Option.subject,
        text: Option.message
    }

    await transporter.sendMail(mailOptions)
}
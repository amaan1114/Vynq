import nodemailer from "nodemailer";
import { config } from "./config.js";

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `${config.CLIENT_URL}/verify/${encodeURIComponent(token)}`;

    await transporter.sendMail({
        from: config.EMAIL_FROM,
        to: email,
        subject: "Verify your email",
        text: `Verify your email by opening this link: ${verificationLink}\n\nThis link expires in 24 hours.`,
        html: `
            <p>Thanks for signing up! Please verify your email by clicking the link below:</p>
            <p><a href="${verificationLink}">Verify Email</a></p>
            <p>This link expires in 24 hours.</p>
        `,
    });
}

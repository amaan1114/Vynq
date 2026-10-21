import dotenv from "dotenv";

dotenv.config();

export const config = {
    //Port Setup
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    //jwt
    JWT_SECRET: process.env.jwtSecret || 'default_secret',
    //email
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
    //client url used for building links in emails
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',


    
}
import { registerAs } from '@nestjs/config';
import { Email } from '../../email/email';

export default registerAs('email', () => ({
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    port: process.env.SMTP_PORT,
    defaultFromEmail: new Email(process.env.EMAIL_DEFAULT_FROM_EMAIL),
    defaultToEmail: process.env.EMAIL_DEFAULT_TO_EMAIL,
    defaultToEmailKey: process.env.EMAIL_DEFAULT_TO_EMAIL_KEY,
}));

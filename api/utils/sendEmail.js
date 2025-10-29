// utils/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // Your Gmail
    pass: process.env.SMTP_PASSWORD, // App password
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: `"Todo Reminder" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });
  return info;
};

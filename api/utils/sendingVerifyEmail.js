// utils/sendingVerifyEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendingVerifyEmail = async (to, code) => {
  const mailOptions = {
    from: `"No-Reply" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; background:#f6f6f6; border-radius:8px; text-align:center;">
        <h2>Verify your email</h2>
        <p>Use this code to verify your account:</p>
        <div style="font-size:32px; margin: 12px 0; font-weight:700;">${code}</div>
        <p style="color:#666">This code expires in 10 minutes.</p>
        <p style="color:#999; font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

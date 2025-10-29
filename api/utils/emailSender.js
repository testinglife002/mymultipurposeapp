// ✅ 3. Create Mail Utility – utils/emailSender.js
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // 16-digit app password
    },
  });

  const mailOptions = {
    from: `"Task Reminder" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};

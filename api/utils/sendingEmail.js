// utils/sendingEmail.js
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // Gmail address
    pass: process.env.GMAIL_APP_PASS,  // 16-digit app password
  },
});

export const sendingEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Task Reminder" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions); // ✅ Correct method
    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
};



/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,        // your email
    pass: process.env.GMAIL_APP_PASS,    // 16-digit app password
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendEmail(mailOptions);
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};
*/

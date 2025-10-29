// 3️⃣ utils/sendingVerifyEmailSendPulseEmail.js
// utils/sendingVerifyEmailSendPulseEmail.js
// utils/sendPulseEmail.js
// utils/sendPulseEmail.js
import dotenv from "dotenv";
import sendpulse from "sendpulse-api";
import path from "path";
import os from "os";

dotenv.config();

const { SENDPULSE_CLIENT_ID, SENDPULSE_CLIENT_SECRET } = process.env;

// Use system temp folder as token storage
const TOKEN_STORAGE = path.join(os.tmpdir(), "sendpulse_tokens");

// Initialize SendPulse once
let initialized = false;
export const initSendPulse = () => {
  if (!initialized) {
    sendpulse.init(SENDPULSE_CLIENT_ID, SENDPULSE_CLIENT_SECRET, TOKEN_STORAGE, () => {
      console.log("SendPulse client initialized successfully");
      initialized = true;
    });
  }
};

// Send verification email using Promise + async/await
export const sendVerificationEmail = async (toEmail, code) => {
  initSendPulse();

  const html = `
    <div style="font-family: Arial, sans-serif; padding:24px; background:#f6f6f6; border-radius:8px; text-align:center;">
      <h2>Verify your email</h2>
      <p>Use this code to verify your account:</p>
      <div style="font-size:32px; margin:12px 0; font-weight:700;">${code}</div>
      <p style="color:#666">This code expires in 10 minutes.</p>
      <p style="color:#999; font-size:12px">If you didn't request this, ignore this email.</p>
    </div>
  `;

  const emailData = {
    email: {
      from: { name: "No-Reply", email: "nazmur.rashid077@gmail.com" },
      to: [{ email: toEmail }],
      subject: "Verify your email",
      html,
    },
  };

  return new Promise((resolve, reject) => {
    sendpulse.smtpSendMail(emailData, {}, (response) => {
      if (response?.result === true) resolve(response);
      else reject(response);
    });
  });
};






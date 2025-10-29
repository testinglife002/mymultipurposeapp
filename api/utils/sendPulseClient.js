// utils/sendPulseClient.js – fully async-ready
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const {
  SENDPULSE_CLIENT_ID,
  SENDPULSE_CLIENT_SECRET,
  SENDPULSE_FROM_EMAIL,
  SENDPULSE_FROM_NAME
} = process.env;

const API_URL = "https://api.sendpulse.com";
let accessToken = null;
let tokenExpiresAt = 0;



async function authenticate() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  console.log("🔐 Requesting new SendPulse token...");
  try {
    const response = await axios.post(`${API_URL}/oauth/access_token`, {
      grant_type: "client_credentials",
      client_id: SENDPULSE_CLIENT_ID,
      client_secret: SENDPULSE_CLIENT_SECRET,
    });

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

    console.log("✅ SendPulse Auth Success");
    console.log("Using SendPulse credentials:", process.env.SENDPULSE_CLIENT_ID ? "✔️ loaded" : "❌ missing");
    console.log("Sender email:", data.email.sender.name, data.email.sender.email);

    return accessToken;
  } catch (err) {
    console.error("❌ SendPulse Authentication Failed:", err.response?.data || err.message);
    throw err;
  }
}


export async function sendVerificationEmail(toEmail, code) {
  const token = await authenticate();

  const payload = {
    email: {
      subject: "Verify your email",
      from: {
        name: SENDPULSE_FROM_NAME,
        email: SENDPULSE_FROM_EMAIL,
      },
      to: [{ email: toEmail }],
      html: `
        <h2>Email Verification</h2>
        <p>Your code:</p>
        <h3>${code}</h3>
      `
    }
  };

  try {
    const response = await axios.post(`${API_URL}/smtp/emails`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Email request success:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ SendPulse API Email Error:", err.response?.data || err.message);
    throw err;
  }
}



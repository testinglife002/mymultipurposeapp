// Example in your /utils/whatsappEmailMessage.js:


// ✅ Step 1: utils/whatsappEmailMessage.js
// Converts email templates to WhatsApp messages and sends them via Twilio
// (same structure as whatsappReminder.js)

import dotenv from "dotenv";
import twilio from "twilio";
import User from "../models/user.model.js";
import { convertEmailToWhatsApp } from "./emailToWhatsApp.js";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox
const TEST_PHONE = "whatsapp:+8801617063739"; // ✅ fixed test number

// ✅ Send WhatsApp message
export const sendWhatsAppMessage = async (to, message) => {
  try {
    const msg = await client.messages.create({
      from: FROM_NUMBER,
      to,
      body: message,
    });
    console.log("✅ WhatsApp message sent:", msg.sid);
    return msg;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.message);
    return null;
  }
};



// ✅ Send Email as WhatsApp Message
export const sendEmailAsWhatsApp = async (user, htmlTemplate) => {
  try {
    if (!user) {
      console.warn("⚠️ No user data provided.");
      return;
    }

    const whatsappMsg = convertEmailToWhatsApp(htmlTemplate);

    // ✅ Always use fixed test phone number for now
    const to = `whatsapp:${TEST_PHONE}`;

    await sendWhatsAppMessage(to, whatsappMsg);
    console.log(`✅ Email template sent to WhatsApp (test): ${user?.username || "Unknown User"}`);
  } catch (err) {
    console.error("❌ Failed to send email as WhatsApp:", err.message);
  }
};




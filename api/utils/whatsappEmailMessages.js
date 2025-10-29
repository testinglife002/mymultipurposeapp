// server/utils/whatsappEmailMessages.js
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

export const sendWhatsAppMessages = async (to, body, mediaUrls = []) => {
  try {
    if (!to.startsWith("whatsapp:")) to = `whatsapp:${to}`;

    const payload = { from: FROM_NUMBER, to, body };
    if (mediaUrls && mediaUrls.length) payload.mediaUrl = mediaUrls;

    const msg = await client.messages.create(payload);
    console.log("✅ WhatsApp message sent:", msg.sid);
    return msg;
  } catch (err) {
    console.error("❌ Failed to send WhatsApp message:", err.message || err);
    throw err;
  }
};

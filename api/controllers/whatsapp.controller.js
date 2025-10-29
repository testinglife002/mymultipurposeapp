// Step 4. Create controllers/whatsapp.controller.js
import twilio from "twilio";
import dotenv from "dotenv";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import WhatsAppMessage from "../models/whatsappMessage.model.js"; // ✅ add .js and match case
// server/controllers/whatsapp.controller.js
import axios from "axios";
// ✅ Correct



dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);



// ✅ Helper: Format phone number to E.164
function formatToE164(raw) {
  const defaultCountry = "BD"; // change if needed
  const p = parsePhoneNumberFromString(raw, defaultCountry);
  if (!p || !p.isValid()) return null;
  return p.number;
}



export const sendWhatsAppMessages = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Missing 'to' or 'message' field." });
    }

    const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message },
    };

    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      response: response.data,
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};



// ✅ Send message through Twilio + store in DB
export const sendWhatsAppMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message)
      return res.status(400).json({ error: "Phone number and message required" });

    const formatted = formatToE164(to);
    if (!formatted) return res.status(400).json({ error: "Invalid phone number" });

    // Twilio Sandbox requires 'whatsapp:' prefix
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });

    // Save message as "sent" in DB
    const savedMessage = await WhatsAppMessage.create({
      to,
      message,
      status: "sent",
      sid: msg.sid,
    });

    res.json({ success: true, message: savedMessage, sid: msg.sid });
  } catch (error) {
    console.error("Twilio error:", error.message);

    // Save failed message
    const failedMessage = await WhatsAppMessage.create({
      to,
      message,
      status: "failed",
    });

    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Save draft
export const saveDraft = async (req, res) => {
  try {
    const { to, message } = req.body;
    const formatted = formatToE164(to);
    if (!formatted) return res.status(400).json({ error: "Invalid phone number" });

    const draft = await WhatsAppMessage.create({
      to: formatted,
      message,
      status: "draft",
    });
    res.json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await WhatsAppMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await WhatsAppMessage.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Send regular WhatsApp text message via Cloud API

/**
 * Send WhatsApp text message via Meta Cloud API
 * Automatically detects if the recipient number can receive messages in sandbox/test mode
 */
export const sendTextMessage = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Missing 'to' or 'message'" });
    }

    const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: to, // must be in international format: 8801617063739
      type: "text",
      text: { body: message },
    };

    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });

    // Check Meta Cloud API response for sandbox/test mode
    const errors = response.data?.error;
    if (errors) {
      console.error("Meta API error:", errors);
      return res.status(400).json({
        success: false,
        error: errors,
        message:
          "Message could not be delivered. Likely the recipient number is not allowed in sandbox/test mode.",
      });
    }

    // Save message to DB
    await WhatsAppMessage.create({
      to,
      message,
      status: "sent",
      sid: response.data.messages?.[0]?.id || null,
    });

    res.json({
      success: true,
      message: "Message sent successfully",
      response: response.data,
    });
  } catch (error) {
    const errData = error.response?.data;
    console.error("Error sending WhatsApp text message:", errData || error.message);

    let userMessage = "Failed to send message.";
    if (errData?.error?.message?.includes("sandbox")) {
      userMessage =
        "Cannot send message: recipient number is not verified in sandbox/test mode.";
    }

    res.status(500).json({
      success: false,
      error: errData || error.message,
      message: userMessage,
    });
  }
};



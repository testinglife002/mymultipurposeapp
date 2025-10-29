// server/controllers/whatsappSenderController.js
// import WhatsAppMessage from "../models/WhatsAppMessage.js";
import twilio from "twilio";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import WhatsAppMessage from "../models/WhatsAppMessage.js";

dotenv.config();

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const FROM_NUMBER = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Twilio sandbox default
const FIXED_TO = "+8801617063739"; // ✅ Hardcoded WhatsApp test number


// 🔹 Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Helper: upload any file type
const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto", // supports image, video, audio, pdf, etc.
  });
  return result.secure_url;
};


export const sendWhatsApp = async (req, res) => {
    console.log(req.body);
  try {
    const { phone, messageText, messageHtml, templateId, userId } = req.body;
    const files = req.files || [];

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is required." });
    }

    const result = await sendTemplateAsWhatsAppMessage({
      phone,
      body: messageText,
      htmlMessage: messageHtml,
      files,
      templateId,
      userId,
    });

    if (result.success) return res.json(result);
    return res.status(400).json(result);
  } catch (err) {
    console.error("Controller sendWhatsApp error:", err.message || err);
    return res
      .status(500)
      .json({ success: false, error: err.message || String(err) });
  }
};


// server/controllers/whatsappSenderController.js
// server/controllers/whatsappSenderController.js
export const sendWhatsAppMessage = async (req, res) => {
  console.log(req.body);
  try {
    const { phone, messageText } = req.body;
    const files = req.files || [];

    if (!phone || !messageText) {
      return res.status(400).json({ ok: false, error: "Phone and messageText are required" });
    }

    const chunks = messageText.match(/[\s\S]{1,1600}/g);
    const mediaUrls = [];

    for (const f of files) {
      const uploadedUrl = await uploadToCloudinary(f.path);
      mediaUrls.push(uploadedUrl);
    }

    const results = [];

    for (let i = 0; i < chunks.length; i++) {
      const msgOptions = {
        from: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886", // Twilio sandbox default
        to: `whatsapp:${phone}`,
        body: chunks[i],
      };
      if (i === 0 && mediaUrls.length > 0) msgOptions.mediaUrl = mediaUrls;

      const msg = await client.messages.create(msgOptions);

      // Save initial record
      const saved = await WhatsAppMessage.create({
        to: phone,
        body: chunks[i],
        type: mediaUrls.length ? "image" : "text",
        mediaUrls,
        status: msg.status || "queued",
        twilioSid: msg.sid,
      });

      // Immediately update to “sent” if confirmed by Twilio
      if (msg.status === "sent" || msg.status === "delivered") {
        saved.status = "sent";
        await saved.save();
      }

      results.push({ twilioSid: msg.sid, status: saved.status });
    }

    res.json({ ok: true, results });
  } catch (error) {
    console.error("sendWhatsAppMessage failed:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};


// server/controllers/whatsappSenderController.js
// import WhatsAppMessage from "../models/WhatsAppMessage.js";
// import { sendWhatsAppMessage } from "../utils/whatsappReminder.js";

/**
 * Send a WhatsApp message to a fixed number
 * POST /api/whatsapp/send
 *//**
 * ✅ Send WhatsApp message to FIXED NUMBER (+8801617063739)
 * Supports: text + image/video/document uploads
 * Route: POST /api/whatsapp/send-fix-message
 */
export const sendFixedWhatsAppMessage = async (req, res) => {

    console.log(req.body);
  try {
    const { body, type } = req.body;
    const files = req.files || [];

    if (!body || body.trim() === "") {
      return res.status(400).json({ error: "Message body is required" });
    }

    // 1️⃣ Upload files (if any)
    const mediaUrls = [];
    for (const file of files) {
      const uploadedUrl = await uploadToCloudinary(file.path);
      mediaUrls.push(uploadedUrl);
    }

    // 2️⃣ Split message if it exceeds 1600 chars
    const chunks = body.match(/[\s\S]{1,1600}/g);

    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      const msgOptions = {
        from: FROM_NUMBER,
        to: `whatsapp:${FIXED_TO}`,
        body: chunks[i],
      };

      // attach media only to first message chunk
      if (i === 0 && mediaUrls.length > 0) msgOptions.mediaUrl = mediaUrls;

      const msg = await client.messages.create(msgOptions);

      // 3️⃣ Save to DB
      const saved = await WhatsAppMessage.create({
        to: FIXED_TO,
        body: chunks[i],
        type: mediaUrls.length
          ? files[0]?.mimetype.split("/")[0] || "document"
          : "text",
        mediaUrls,
        status: msg.status || "queued",
        twilioSid: msg.sid,
      });

      // update if confirmed sent
      if (msg.status === "sent" || msg.status === "delivered") {
        saved.status = "sent";
        await saved.save();
      }

      results.push({ sid: msg.sid, status: saved.status });
    }

    return res.status(200).json({
      success: true,
      message: "WhatsApp message sent successfully",
      results,
    });
  } catch (error) {
    console.error("❌ sendFixedWhatsAppMessage Error:", error);
    res.status(500).json({ error: error.message || "Failed to send message" });
  }
};




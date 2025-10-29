// Controller – whatsappMessageController.js
// controllers/whatsappMessageController.js
import WhatsAppMessage from "../models/WhatsAppMessage.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Split text message into 1600-character chunks
const splitMessage = (text) => {
  const maxLength = 1600;
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + maxLength));
    start += maxLength;
  }
  return chunks;
};

// Mock WhatsApp API sender (replace with actual API integration)
// Mock WhatsApp API call (replace with Twilio / WhatsApp Cloud API)
const sendWhatsAppAPI = async ({ to, body, mediaUrls, type }) => {
  console.log(`📤 Sending WhatsApp message to ${to}`);
  console.log(`Type: ${type}, Body: ${body?.slice(0, 50)}...`);
  if (mediaUrls) console.log(`Media URL: ${mediaUrls}`);
  return { success: true }; // Simulate successful send
};

// Controller: Send WhatsApp message
export const sendMessage = async (req, res) => {
    console.log(req.body);
  try {
    const { to, body, type = "text", templateId, userId } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, error: "Recipient number (to) is required." });
    }

    // let mediaUrl = null;

    // Upload media files to Cloudinary if provided
    let mediaUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        mediaUrls.push(uploadRes.secure_url);
        fs.unlinkSync(file.path); // Cleanup local file
      }
    }

    const textChunks = splitMessage(body || "");
    const results = [];

    for (const chunk of textChunks) {
      const apiResult = await sendWhatsAppAPI({ to, text: chunk, mediaUrls, type });
      const message = await WhatsAppMessage.create({
        to,
        body: chunk,
        type,
        mediaUrls,
        templateId: templateId || null,
        userId: userId || null,
        status: sendResult.success ? "sent" : "failed",
        error: sendResult.success ? null : "Send failed",
      });
      results.push({
        messageId: messageDoc._id,
        status: messageDoc.status,
        body: chunk,
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      messages: results,
      message: "Messages processed successfully."
    });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Controller: Get all messages (optional)
// Controller: Fetch all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await WhatsAppMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Controller: Get single message by ID
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await WhatsAppMessage.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found." });
    }
    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



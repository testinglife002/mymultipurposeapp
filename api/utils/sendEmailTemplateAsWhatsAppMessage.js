// server/utils/sendEmailTemplateAsWhatsAppMessage.js
import { convertEmailToWhatsApp } from "./emailToWhatsApp.js";
import EmailTemplate from "../models/EmailTemplate.js";
import WhatsAppMessage from "../models/WhatsAppMessage.js";
import { uploadFilesToCloudinary } from "./sendWhatsAppFilesAndText.js";
import { sendWhatsAppMessages } from "./whatsappEmailMessages.js";

const MAX_LEN = 1600;
const CHUNK_DELAY_MS = 700;

const splitMessage = (text) => {
  if (!text) return [];
  if (text.length <= MAX_LEN) return [text];

  const chunks = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= MAX_LEN) {
      chunks.push(remaining);
      break;
    }

    let cutAt = remaining.lastIndexOf("\n", MAX_LEN);
    if (cutAt === -1 || cutAt < MAX_LEN * 0.6) {
      cutAt = remaining.lastIndexOf(" ", MAX_LEN);
    }
    if (cutAt === -1 || cutAt < MAX_LEN * 0.6) cutAt = MAX_LEN;

    const part = remaining.slice(0, cutAt).trim();
    chunks.push(part);
    remaining = remaining.slice(cutAt).trim();
  }
  return chunks;
};

export const sendTemplateAsWhatsAppMessage = async ({
  phone,
  htmlMessage,
  plainTextMessage,
  files = [],
  templateId = null,
  userId = null,
}) => {
  try {
    if (!phone) throw new Error("Missing 'phone' parameter.");

    let message;
    if (plainTextMessage?.trim()) {
      message = plainTextMessage.trim();
    } else if (htmlMessage) {
      message = convertEmailToWhatsApp(htmlMessage, "SuperApp");
    } else if (templateId) {
      const tpl = await EmailTemplate.findById(templateId);
      if (!tpl) throw new Error("Template not found.");
      message = convertEmailToWhatsApp(tpl.html, "SuperApp");
    } else {
      throw new Error("No message content provided.");
    }

    const mediaUrls = files.length ? await uploadFilesToCloudinary(files) : [];
    const chunks = splitMessage(message);

    const log = await WhatsAppMessage.create({
      to: phone,
      body: message.slice(0, 800),
      mediaUrls,
      status: "queued",
      templateId,
      userId,
      type: mediaUrls.length ? "media" : "text",
    });

    for (let i = 0; i < chunks.length; i++) {
      const attachMedia = i === 0 ? mediaUrls : [];
      await sendWhatsAppMessages(phone, chunks[i], attachMedia);
      if (i < chunks.length - 1)
        await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
    }

    await WhatsAppMessage.findByIdAndUpdate(log._id, {
      status: "sent",
      body: message,
    });

    return { success: true, to: phone, media: mediaUrls };
  } catch (err) {
    console.error("sendTemplateAsWhatsApp failed:", err.message || err);
    return { success: false, error: err.message || String(err) };
  }
};

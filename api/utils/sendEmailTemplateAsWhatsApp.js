// server/utils/sendEmailTemplateAsWhatsApp.js
// 🧩 2️⃣ Extend WhatsApp Utility
// Add a helper that can send converted templates.
// server/utils/sendEmailTemplateAsWhatsApp.js
// server/utils/sendEmailTemplateAsWhatsApp.js
// utils/sendEmailTemplateAsWhatsApp.js
// server/utils/sendEmailTemplateAsWhatsApp.js
// utils/sendEmailTemplateAsWhatsApp.js
// server/utils/sendEmailTemplateAsWhatsApp.js
import { convertEmailToWhatsApp } from "./emailToWhatsApp.js";
import User from "../models/user.model.js";
import EmailTemplate from "../models/EmailTemplate.js";
import { sendWhatsAppMessage } from "./whatsappEmailMessage.js";

const FIXED_TEST_PHONE = "whatsapp:+8801617063739";
const MAX_WHATSAPP_LENGTH = 1600; // Twilio limit

export const sendTemplateAsWhatsApp = async (userId, templateId) => {
  try {
    // 1️⃣ Validate IDs
    if (!templateId)
      throw new Error("Missing templateId — cannot send WhatsApp message.");

    const tpl = await EmailTemplate.findById(templateId);
    if (!tpl) throw new Error("Email template not found.");

    // 2️⃣ Optional: Load user (but not required for test mode)
    let user = null;
    if (userId) {
      user = await User.findById(userId).select("phone username");
    }

    // 3️⃣ Convert HTML to WhatsApp-friendly text
    let message = convertEmailToWhatsApp(tpl.html, "SuperApp");

    // 4️⃣ Enforce Twilio limit
    if (message.length > MAX_WHATSAPP_LENGTH) {
      console.warn(
        `⚠️ Message too long (${message.length} chars). Trimming to ${MAX_WHATSAPP_LENGTH}.`
      );
      message = message.slice(0, MAX_WHATSAPP_LENGTH - 50) + "\n\n[...] ✂️ message truncated";
    }

    // 5️⃣ Always send to fixed test number for now
    const to = FIXED_TEST_PHONE;

    const sent = await sendWhatsAppMessage(to, message);
    if (!sent)
      throw new Error(
        "Twilio message not delivered — check sandbox join status or credentials."
      );

    console.log(`✅ WhatsApp template "${tpl.name}" sent to ${to}`);
    return { success: true, to };
  } catch (err) {
    console.error("❌ Failed to send template:", err.message);
    return { success: false, error: err.message };
  }
};










/*
import mongoose from "mongoose";
import { convertEmailToWhatsApp } from "./emailToWhatsApp.js";
import User from "../models/user.model.js";
import EmailTemplate from "../models/EmailTemplate.js";
import { sendWhatsAppMessage } from "./whatsappEmailMessage.js";

const DEFAULT_WHATSAPP_NUMBER = "+8801617063739"; // ✅ Hardcoded fallback number

export const sendTemplateAsWhatsApp = async (userId, templateId) => {
  try {
    // 1️⃣ Fetch user info (phone, name)
    let user = null;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select("phone username");
    } else if (userId) {
      console.warn("⚠️ Invalid userId format, skipping user lookup.");
    }
    // const user = await User.findById(userId).select("phone username");

    // 2️⃣ Fetch the template
    const tpl = await EmailTemplate.findById(templateId);
    if (!tpl) throw new Error("Email template not found.");

    // 3️⃣ Convert HTML → WhatsApp-friendly text
    const message = convertEmailToWhatsApp(tpl.html, "SuperApp");

    // 4️⃣ Use user's phone if available, else fallback
    const targetPhone = user?.phone || DEFAULT_WHATSAPP_NUMBER;
    const to = targetPhone.startsWith("whatsapp:")
      ? targetPhone
      : `whatsapp:${targetPhone}`;

    // 5️⃣ Send the WhatsApp message
    await sendWhatsAppMessage(to, message);

    console.log(
      `✅ Template "${tpl.name}" sent to ${user?.username || "Unknown User"} at ${targetPhone}`
    );

    return { success: true, to: targetPhone };
  } catch (err) {
    console.error("❌ Failed to send template via WhatsApp:", err.message);
    return { success: false, error: err.message };
  }
};
*/





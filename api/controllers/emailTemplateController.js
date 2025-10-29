// server/controllers/emailTemplateController.js
import EmailTemplate from "../models/EmailTemplate.js";
import fs from "fs";
// import cloudinary from "../utils/cloudinary.js"; // assuming Cloudinary is configured
import { v2 as cloudinary } from "cloudinary";
import { sendTemplateAsWhatsApp } from "../utils/sendEmailTemplateAsWhatsApp.js";


// Configure Cloudinary (if env set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE
export const createTemplate = async (req, res) => {
  try {
    const { name, html } = req.body;
    let imageUrl = "";

    if (req.file) {
      if (process.env.USE_CLOUDINARY === "true") {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "templates",
          resource_type: "image",
        });
        imageUrl = result.secure_url;
        await fs.promises.unlink(req.file.path).catch(() => {});
      } else {
        imageUrl = `/public/uploads/templates/${req.file.filename}`;
      }
    }

    const newTemplate = new EmailTemplate({
      name,
      html,
      css: req.body.css || "",
      image: imageUrl,
    });

    await newTemplate.save();
    res.status(201).json({ success: true, template: newTemplate });
  } catch (err) {
    console.error(err);
    if (req.file) await fs.promises.unlink(req.file.path).catch(() => {});
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE
export const updateTemplate = async (req, res) => {
  try {
    const { name, html, css } = req.body;
    let imageUrl;

    if (req.file) {
      if (process.env.USE_CLOUDINARY === "true") {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "templates",
          resource_type: "image",
        });
        imageUrl = result.secure_url;
        await fs.promises.unlink(req.file.path).catch(() => {});
      } else {
        imageUrl = `/public/uploads/templates/${req.file.filename}`;
      }
    }

    const updateData = { name, html, css };
    if (imageUrl) updateData.image = imageUrl;

    const updatedTpl = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTpl)
      return res.status(404).json({ success: false, error: "Template not found" });

    res.json({ success: true, template: updatedTpl });
  } catch (err) {
    console.error(err);
    if (req.file) await fs.promises.unlink(req.file.path).catch(() => {});
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET ALL
export const getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET ONE
export const getTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template)
      return res.status(404).json({ success: false, error: "Template not found" });
    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE
export const deleteTemplate = async (req, res) => {
  try {
    const tpl = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!tpl) return res.status(404).json({ success: false, error: "Template not found" });
    res.json({ success: true, message: "Template deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// server/controllers/whatsappTemplateController.js
// import { sendTemplateAsWhatsApp } from "../utils/sendEmailTemplateAsWhatsApp.js";
/*
export const sendTemplateWhatsApp = async (req, res) => {
  try {
    const { userId, templateId } = req.body;

    // 1️⃣ Validate required params
    if (!userId && !templateId) {
      console.warn("⚠️ Missing both userId and templateId in request body.");
      return res.status(400).json({
        success: false,
        error:
          "Both userId and templateId are missing. Please provide at least a templateId. The userId is optional (fallback number will be used).",
        example: {
          userId: "670fd12e9eaa89e23b3abcde",
          templateId: "670fda45d2b812e21a1f6789",
        },
      });
    }

    if (!templateId) {
      console.warn("⚠️ Missing templateId in WhatsApp send request.");
      return res.status(400).json({
        success: false,
        error: "Template ID is required to send WhatsApp message.",
      });
    }

    // 2️⃣ Log if userId is missing (will fallback automatically)
    if (!userId) {
      console.warn("⚠️ No userId provided. Using default fallback WhatsApp number (+8801617063739).");
    }

    // 3️⃣ Delegate to helper (handles fallback internally)
    const result = await sendTemplateAsWhatsApp(userId, templateId);

    // 4️⃣ Success or failure response
    if (result.success) {
      return res.json({
        success: true,
        to: result.to,
        message: "✅ WhatsApp template sent successfully.",
      });
    }

    // 5️⃣ Graceful failure (e.g., invalid ID or Twilio issue)
    res.status(400).json({
      success: false,
      error: result.error || "Failed to send WhatsApp message.",
    });
  } catch (err) {
    // 6️⃣ Catch any unexpected runtime errors
    console.error("❌ Controller error (sendTemplateWhatsApp):", err.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error: " + err.message,
    });
  }
};
*/

// server/controllers/emailTemplateController.js (bottom section)
// import { sendTemplateAsWhatsApp } from "../utils/sendEmailTemplateAsWhatsApp.js";

export const sendTemplateWhatsApp = async (req, res) => {
  try {
    const { userId, templateId } = req.body;

    // 🧩 Validate request inputs
    if (!userId && !templateId) {
      console.warn("⚠️ Missing both userId and templateId in WhatsApp send request.");
      return res.status(400).json({
        success: false,
        error:
          "Missing both userId and templateId. Please provide at least templateId. userId is optional (fallback test number will be used).",
        example: {
          userId: "670fd12e9eaa89e23b3abcde",
          templateId: "670fda45d2b812e21a1f6789",
        },
      });
    }

    if (!templateId) {
      console.warn("⚠️ Missing templateId — cannot send message.");
      return res.status(400).json({
        success: false,
        error: "Template ID is required to send WhatsApp message.",
      });
    }

    // 🧩 Optional notice for userId
    if (!userId) {
      console.warn("⚠️ No userId provided — sending to default test WhatsApp number.");
    }

    // ✅ Delegate actual sending
    const result = await sendTemplateAsWhatsApp(userId, templateId);

    if (result.success) {
      return res.json({
        success: true,
        message: "✅ WhatsApp template sent successfully (test mode).",
        to: result.to,
      });
    }

    // 🧩 Graceful Twilio error handling
    return res.status(400).json({
      success: false,
      error: result.error || "Failed to send WhatsApp message (Twilio API issue).",
    });
  } catch (err) {
    console.error("❌ Controller error (sendTemplateWhatsApp):", err.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error: " + err.message,
    });
  }
};







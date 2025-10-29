// ### backend/controllers/textTemplate.controller.js
// import cloudinary from '../utils/cloudinary.js';
import cloudinary from "../config/cloudinary.js";
import TextTemplate from "../models/TextTemplate.model.js";

/**
 * Helper: upload in-memory buffer to Cloudinary
 */
async function uploadBufferToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "mern-text-styling" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

/**
 * @route POST /api/text-templates
 * @desc Create a new text template
 */
export const createTemplate = async (req, res) => {
  try {
    const body = JSON.parse(req.body.data || "{}");

    // If an image file is uploaded, send to Cloudinary
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      body.bgImageUrl = uploaded.secure_url;
    }

    // Fallback: convert single text field to a layer (for compatibility)
    if (!body.layers && body.text) {
      body.layers = [
        {
          id: "layer-1",
          type: "text",
          text: body.text,
          fontSize: body.fontSize,
          color: body.color,
          palette: body.palette,
          effect: body.effect,
          x: body.pos?.x ?? 50,
          y: body.pos?.y ?? 50,
          zIndex: body.zIndex ?? 2,
          opacity: body.opacity ?? 1,
        },
      ];
    }

    const tpl = new TextTemplate(body);
    await tpl.save();
    res.status(201).json(tpl);
  } catch (err) {
    console.error("Create template error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @route POST /api/text-templates/upload
 * @desc Upload background image only (for layer backgrounds)
 */
export const uploadImageOnly = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const uploaded = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname
    );
    res.status(200).json({ url: uploaded.secure_url });
  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

/**
 * @route GET /api/text-templates
 * @desc List all templates (limit 50)
 */
export const listTemplates = async (req, res) => {
  try {
    const list = await TextTemplate.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(list);
  } catch (err) {
    console.error("List templates error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route GET /api/text-templates/:id
 * @desc Get a single template by ID
 */
export const getTemplate = async (req, res) => {
  try {
    const tpl = await TextTemplate.findById(req.params.id);
    if (!tpl)
      return res.status(404).json({ message: "Template not found" });
    res.json(tpl);
  } catch (err) {
    console.error("Get template error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route PUT /api/text-templates/:id
 * @desc Update template (with optional background image)
 */
export const updateTemplate = async (req, res) => {
  try {
    const body = JSON.parse(req.body.data || "{}");

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      body.bgImageUrl = uploaded.secure_url;
    }

    const tpl = await TextTemplate.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    if (!tpl)
      return res.status(404).json({ message: "Template not found" });
    res.json(tpl);
  } catch (err) {
    console.error("Update template error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route DELETE /api/text-templates/:id
 * @desc Delete a template by ID
 */
export const deleteTemplate = async (req, res) => {
  try {
    const deleted = await TextTemplate.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Template not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete template error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


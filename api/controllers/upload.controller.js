// controllers/upload.controller.js)
// controllers/upload.controller.js
import cloudinary from "../config/cloudinary.js";
import Upload from "../models/upload.model.js"; // store in DB

// Upload a single file
export const uploadFile = async (req, res) => {
  try {
    const { category } = req.body; // e.g. "image", "template", "background"
    const fileUrl = req.file.path;

    const newUpload = await Upload.create({
      url: fileUrl,
      category,
      public_id: req.file.filename,
    });

    res.status(200).json({ success: true, data: newUpload });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Load files dynamically by category
export const getFilesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const uploads = await Upload.find({ category });
    res.status(200).json({ success: true, data: uploads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
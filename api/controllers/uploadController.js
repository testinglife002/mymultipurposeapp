// controllers/uploadController.js
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    // multer puts file at req.file.path
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "my_banner_app/uploads"
    });

    // delete temp file
    fs.unlinkSync(req.file.path);

    return res.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
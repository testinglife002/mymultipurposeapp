// server/utils/sendWhatsAppFilesAndText.js
// server/utils/sendWhatsAppFilesAndText.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFilesToCloudinary = async (files = []) => {
  const urls = [];
  for (const f of files) {
    try {
      const res = await cloudinary.uploader.upload(f.path, {
        resource_type: "auto",
        folder: "whatsapp_media",
      });
      urls.push(res.secure_url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err.message || err);
    } finally {
      try {
        await fs.unlink(f.path);
      } catch {}
    }
  }
  return urls;
};
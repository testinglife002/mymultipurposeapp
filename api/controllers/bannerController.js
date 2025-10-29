// controllers/bannerController.js
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Banner from "../models/Banner.js";
import cloudinary from "../utils/cloudinary.js";

export const saveExportedBanner = async (req, res) => {
  try {
    const { dataUrl, backgroundUrl, mainUrl } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Validate base64 Data URL
    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ message: "Invalid data URL" });
    }

    const ext = matches[1].split("/")[1]; // e.g., png, jpg
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public/uploads/banner");
    fs.mkdirSync(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = `banner-${Date.now()}-${uuidv4()}.${ext}`;
    const localPath = path.join(uploadDir, filename);
    fs.writeFileSync(localPath, buffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: "my_banner_app/banners",
    });

    // Save banner metadata to DB
    const bannerDoc = await Banner.create({
      backgroundUrl: backgroundUrl || "",
      mainUrl: mainUrl || "",
      exportedUrl: uploadResult.secure_url,
      localPath: `/uploads/banner/${filename}`,
    });

    res.status(201).json({
      message: "✅ Banner exported and saved successfully",
      localPath: `/uploads/banner/${filename}`,
      cloudUrl: uploadResult.secure_url,
      banner: bannerDoc,
    });
  } catch (error) {
    console.error("❌ Banner export failed:", error);
    res.status(500).json({
      message: "Failed to save banner",
      error: error.message,
    });
  }
};


// Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners", error: err.message });
  }
};

// Update a banner (only metadata for simplicity)
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { backgroundUrl, mainUrl } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { backgroundUrl, mainUrl },
      { new: true }
    );

    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner updated", banner });
  } catch (err) {
    res.status(500).json({ message: "Failed to update banner", error: err.message });
  }
};

// Delete a banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Delete local file if exists
    if (banner.localPath) {
      const filePath = path.join(process.cwd(), "public", banner.localPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Optionally: Delete from Cloudinary
    if (banner.exportedUrl) {
      const publicId = banner.exportedUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`my_banner_app/banners/${publicId}`);
    }

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner", error: err.message });
  }
};


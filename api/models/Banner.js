// Model — Banner (optional, stores URLs & metadata)
// models/Banner.js
import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  backgroundUrl: { type: String, required: true },
  mainUrl: { type: String, required: true },
  exportedUrl: { type: String }, // cloudinary url of exported banner
  localPath: { type: String },   // local path e.g. /uploads/banner/xxx.png
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Banner", BannerSchema);

// models/upload.model.js
// models/upload.model.js
import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  category: { type: String, enum: ["design", "project", "template", "image", "background"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Upload", uploadSchema);
// 3️⃣ server/models/EmailTemplate.js
// server/models/EmailTemplate.js
import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  html: { type: String, required: true },
  css: { type: String, default: "" },
  image: { type: String, default: "" }, // ✅ image URL
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("EmailTemplate", emailTemplateSchema);


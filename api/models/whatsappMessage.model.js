// 🧩 4️⃣ WhatsApp Message Model
// models/whatsappMessage.model.js
import mongoose from "mongoose";

const WhatsAppMessageSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "draft", "failed"],
      default: "draft",
    },
    sid: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("WhatsAppMessage", WhatsAppMessageSchema);
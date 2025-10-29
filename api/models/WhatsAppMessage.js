// server/models/WhatsAppMessage.js
// server/models/WhatsAppMessage.js
import mongoose from "mongoose";

const WhatsAppMessageSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "document"],
      default: "text",
    },
    mediaUrls: [{ type: String }],
    status: {
      type: String,
      enum: ["queued", "sent", "delivered", "failed"],
      default: "queued",
    },
    twilioSid: { type: String },
  },
  { timestamps: true }
);


// ✅ Prevent OverwriteModelError
const WhatsAppMessage =
  mongoose.models.WhatsAppMessage ||
  mongoose.model("WhatsAppMessage", WhatsAppMessageSchema);

export default WhatsAppMessage;


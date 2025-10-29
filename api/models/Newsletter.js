// 4️⃣ server/models/Newsletter.js 
import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("Newsletter", newsletterSchema);
// backend/models/post.model.js
// backend/models/post.model.js
import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({ type: Object }, { _id: false });

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  blocks: { type: [BlockSchema], default: [] },
  content: { type: String, default: null },
  trending: { type: String, enum: ["yes", "no"], default: "no" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  categoryTitle: String,
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategoryTitle: String,
  tags: [String],
  hashtags: [String],
  images: { type: [ImageSchema], default: [] },
  primaryImg: { type: String, default: "" },
  featuredImage: { type: String, default: "" },
  audioUrl: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  status: { type: String, enum: ["published", "draft", "pending"], default: "draft" },
  scheduledDate: Date,
  publishedByAdmin: { type: Boolean, default: false },
  allowComments: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);



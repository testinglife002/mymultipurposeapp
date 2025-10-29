// backend/models/comment.model.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    approved: { type: Boolean, default: false }, // Admin/Author must approve
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);

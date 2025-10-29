//models/user.model.js (updated)
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    img: String,
    country: String,
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number format"],
    },
    desc: String,
    isAuthor: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["admin", "author", "user"],
      default: "user",
    },
    isAdmin: { type: Boolean, default: false },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verifyCode: String,
    verifyCodeExpires: Date,
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite errors in dev with hot-reload
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

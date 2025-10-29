//models/project.model.js 
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

// Virtual populate to get apps belonging to this project
projectSchema.virtual("apps", {
  ref: "App",
  localField: "_id",
  foreignField: "project"
});

projectSchema.set("toObject", { virtuals: true });
projectSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Project", projectSchema);

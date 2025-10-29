//models/app.model.js 
import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["notes", "todos", "task_manager", "trello", "canva"], 
    required: true 
  },
  data: { type: mongoose.Schema.Types.Mixed } // app-specific content
}, { timestamps: true });

export default mongoose.model("App", appSchema);

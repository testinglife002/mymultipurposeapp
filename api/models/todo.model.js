// models/todo.model.js
import mongoose from "mongoose";

const subtodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: {  type: String,  enum: ["low", "medium", "high"],  default: "medium", },  
  completed: { type: Boolean, default: false },
}, { _id: true, timestamps: true });

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { _id: true, timestamps: true });


const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    // 🗓️ Date-only fields & 🕒 Full timestamp fields
    start: { type: Date, default: null, required: false },
    end: { type: Date, default: null, required: false },
    dueDate: { type: Date, default: null, required: false },
    duration: { type: Number, default: 0, min: 0, max: 14400 }, // max 10 days or 240 hrs // in minutes
    completed: { type: Boolean, default: false },
    marked: { type: Boolean, default: false },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { 
      type: String, 
      enum: ["pending", "todo", "in-progress", "done"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    notified: { type: Boolean, default: false },
    recurringProcessed: { type: Boolean, default: false }, // for recurring tasks
    reminder: { type: Date, default: null },
    remindMe: [
      {
      type: {
        type: String,
        enum: ['year', 'month', 'week', 'day', 'hour', 'minute'],
        required: true
      },
      value: { type: Number, required: true, min: 1 }
      }
    ],
      remindersSent: {
      type: [String],
      default: []
    },
    reminders: {
      sentCreated: { type: Boolean, default: false },
      sent1DayBefore: { type: Boolean, default: false },
      sent1HourBefore: { type: Boolean, default: false },
      sentRecurring: { type: Boolean, default: false }
    },
    color: { type: String, default: null, required: false },
    notifyVia: {
      type: [String],
      enum: ["email", "push", "sms"],
      default: [],
    },
    tags: [String],
    subtodos: [subtodoSchema],
    completedPercent: {
      type: Number,
      default: 0,
    },
    dueStatus: {
      type: String,
      enum: ["overdue", "due-soon", "due-later", "no-due-date"],
      default: "no-due-date",
    },
    comments: [commentSchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate completedPercent on save
todoSchema.pre("save", function (next) {
  if (!this.subtodos || this.subtodos.length === 0) {
    this.completedPercent = 0;
    return next();
  }

  const total = this.subtodos.length;
  const completed = this.subtodos.filter((s) => s.completed).length;
  this.completedPercent = Math.round((completed / total) * 100);
  next();
});

// Auto-calculate completedPercent on findOneAndUpdate
todoSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  const subtodos =
    update.subtodos || update.$set?.subtodos;

  if (!Array.isArray(subtodos)) return next();

  const total = subtodos.length;
  const completed = subtodos.filter((s) => s.completed).length;
  const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (update.$set) {
    update.$set.completedPercent = completedPercent;
  } else {
    update.completedPercent = completedPercent;
  }

  // Auto-calculate dueStatus
  const dueDate = update.dueDate || update.$set?.dueDate;
  if (dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    let dueStatus = "due-later";

    if (due < now) {
      dueStatus = "overdue";
    } else {
      const diff = due - now;
      const hours = diff / (1000 * 60 * 60);
      if (hours <= 48) {
        dueStatus = "due-soon";
      }
    }

    if (update.$set) {
      update.$set.dueStatus = dueStatus;
    } else {
      update.dueStatus = dueStatus;
    }
  }

  this.setUpdate(update);
  next();
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;

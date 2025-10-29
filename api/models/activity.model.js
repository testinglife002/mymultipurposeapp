// /models/activity.model.js
// /models/activity.model.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g., "list_created", "card_moved"
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  entity: {
    type: String, // e.g., "list", "card"
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId, // optional, can store listId or cardId
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: false,
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
    required: false,
  },
  details: {
    type: Object, // flexible object, e.g., { oldTitle, newTitle }
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;

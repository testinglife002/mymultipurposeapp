// backend/models/notification.model.js
// backend/models/notification.model.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional if userIds used
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // multiple recipients
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: { type: String, required: true }, // 'task_created', 'task_updated', etc.
    title: { type: String, required: true },
    message: { type: String },
    referenceId: { type: mongoose.Schema.Types.ObjectId, default: null }, // task id
    url: { type: String, default: null },
    isSeen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    meta: { type: mongoose.Schema.Types.Mixed },
});

NotificationSchema.index({ user: 1, isSeen: 1 });

export default mongoose.model('Notification', NotificationSchema);

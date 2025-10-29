// utils/notify.js
import Notification from "../models/notification.model.js";
// import { sendSSE } from "../routes/notification.route.js";

export const pushNotification = async ({ userIds, type, action, entityId, message }) => {
  const notifs = userIds.map((user) => ({
    user,
    type,
    action,
    entityId,
    message,
  }));

  const created = await Notification.insertMany(notifs);

  // broadcast to SSE
  userIds.forEach((uid) => {
    sendSSE({
      user: uid,
      type,
      action,
      entityId,
      message,
      createdAt: new Date(),
    });
  });

  return created;
};

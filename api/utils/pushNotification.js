// backend/utils/pushNotification.js
import Notification from '../models/notification.model.js';

/**
 * Push notifications to one or multiple users.
 * Actor is always the logged-in user.
 * - Single recipient: `user`
 * - Multiple recipients: `userIds`
 */
export async function pushNotification({
  actor,          // required: logged-in user ID
  user = null,    // single recipient
  userIds = [],   // multiple recipients
  type,           // required
  title,          // required
  message = '',
  referenceId = null,
  url = null,
  meta = {}
}) {
  if (!actor) throw new Error('Actor (logged-in user) is required');
  if (!type || !title) throw new Error('Notification type and title are required');

  const notifications = [];

  // Single recipient
  if (user) {
    notifications.push({
      user,
      actor,
      type,
      title,
      message,
      referenceId,
      url,
      meta,
      isSeen: false
    });
  }

  // Multiple recipients
  if (Array.isArray(userIds) && userIds.length > 0) {
    for (const uid of userIds) {
      // Always store each notification separately with `userIds` as array for consistency
      notifications.push({
        userIds: [uid],
        actor,
        type,
        title,
        message,
        referenceId,
        url,
        meta,
        isSeen: false
      });
    }
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
}

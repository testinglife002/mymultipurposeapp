// backend/controllers/notification.controller.js
import Notification from '../models/notification.model.js';

/**
 * Create a notification
 * payload: { user, userIds, actor, type, title, message, referenceId, url, meta }
 */
export const createNotification = async (req, res) => {
  try {
    const payload = req.body;
    const notification = await Notification.create(payload);
    return res.status(201).json(notification);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not create notification' });
  }
};

/**
 * Get notifications for logged-in user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({
      $or: [
        { user: userId },
        { userIds: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json(notifications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch notifications' });
  }
};

/**
 * Get unseen notification count for logged-in user
 */
export const getUnseenCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Notification.countDocuments({
      $or: [
        { user: userId },
        { userIds: userId }
      ],
      isSeen: false
    });

    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch unseen count' });
  }
};

/**
 * Mark a single notification as seen
 */
export const markAsSeen = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const notif = await Notification.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { user: userId },
          { userIds: userId }
        ]
      },
      { isSeen: true },
      { new: true }
    );

    return res.json(notif);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not mark notification as seen' });
  }
};

/**
 * Mark all notifications as seen for logged-in user
 */
export const markAllAsSeen = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      {
        $or: [
          { user: userId },
          { userIds: userId }
        ],
        isSeen: false
      },
      { isSeen: true }
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not mark all as seen' });
  }
};

/**
 * Delete a notification for logged-in user
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await Notification.findOneAndDelete({
      _id: id,
      $or: [
        { user: userId },
        { userIds: userId }
      ]
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not delete notification' });
  }
};

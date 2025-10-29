// 'src/utils/notificationUtils'; // path to your helper
// src/utils/notificationUtils.js
export const hasSeenNotification = (id) => {
  const seen = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
  return seen.includes(id);
};

export const markNotificationSeen = (id) => {
  const seen = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
  if (!seen.includes(id)) {
    seen.push(id);
    localStorage.setItem("seenNotifications", JSON.stringify(seen));
  }
};

export const showBrowserNotification = (title, options, uniqueId) => {
  if (Notification.permission === 'granted' && !hasSeenNotification(uniqueId)) {
    new Notification(title, {
      ...options,
      icon: '/reminder-icon.png',
    });
    markNotificationSeen(uniqueId);
  }
};

/*
export const showBrowserNotification = (title, options) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      ...options,
      icon: '/reminder-icon.png', // optional
    });
  }
};
*/


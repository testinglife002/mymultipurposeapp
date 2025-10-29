// reminderScheduler.js
// reminderScheduler.js
// ✅ This file will schedule local browser notifications for upcoming todos

export const scheduleRemindersForTodo = (todo) => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const now = new Date();
  const startDate = new Date(todo.startDateTime);

  if (startDate <= now) return; // Skip past todos

  // Loop through custom reminders (e.g. 1 day before, 1 hour before)
  todo.reminders?.forEach((reminder) => {
    const millisecondsBefore = convertToMilliseconds(reminder);
    const scheduledTime = startDate.getTime() - millisecondsBefore;

    if (scheduledTime > now.getTime()) {
      const timeout = scheduledTime - now.getTime();
      setTimeout(() => {
        showNotification(todo);
      }, timeout);
    }
  });
};

function convertToMilliseconds({ type, value }) {
  switch (type) {
    case "minute": return value * 60 * 1000;
    case "hour": return value * 60 * 60 * 1000;
    case "day": return value * 24 * 60 * 60 * 1000;
    case "week": return value * 7 * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}

function showNotification(todo) {
  new Notification("⏰ Todo Reminder", {
    body: `Upcoming: ${todo.title}\nDue: ${new Date(todo.startDateTime).toLocaleString()}`,
    icon: "/notification-icon.png", // Optional icon
  });
}

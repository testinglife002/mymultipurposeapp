import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { showBrowserNotification } from './notificationUtils';

const useCountdownWithReminder = (targetDate, reminders) => {

  const [timeLeft, setTimeLeft] = useState({});
  const [firedReminders, setFiredReminders] = useState([]);

  if (!Array.isArray(reminders)) {
    reminders = [];
  }


  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const target = dayjs(targetDate);
      const diffMs = target.diff(now);

      const diffDuration = dayjs.duration(diffMs);

      // Calculate display countdown
      const displayCountdown = {
        days: diffDuration.days(),
        hours: diffDuration.hours(),
        minutes: diffDuration.minutes(),
        seconds: diffDuration.seconds(),
        totalMs: diffMs,
      };
      setTimeLeft(displayCountdown);

      if (diffMs <= 3600 && diffMs > 0) {
        console.log('🔔 Todo Reminder ⏰')
        console.log(`⏰ "${diffMs}" starts in less than an hour!`)
      }
      
      // console.log(reminders)

      // Check each reminder
      const safeReminders = Array.isArray(reminders) ? reminders : [];

      safeReminders.forEach((reminder) => {
        const offsetMs = reminder.type === 'day'
          ? reminder.value * 24 * 60 * 60 * 1000
          : reminder.value * 60 * 60 * 1000;

        const shouldTrigger = Math.abs(diffMs - offsetMs) < 1000;
        const uniqueId = `${target.format()}-${reminder.type}-${reminder.value}`;

        if (shouldTrigger && !firedReminders.includes(uniqueId)) {
          const message = `🔔 ${reminder.value} ${reminder.type}(s) before "${target.format('YYYY-MM-DD HH:mm')}"`;

          alert(message); // for dev
          console.log('Todo Reminder ⏰', message);
          showBrowserNotification('Todo Reminder ⏰', { body: message }, uniqueId);

          setFiredReminders((prev) => [...prev, uniqueId]);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, reminders, firedReminders]);

  return timeLeft;
};

export default useCountdownWithReminder;

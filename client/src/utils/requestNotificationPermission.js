// src/utils/requestNotificationPermission.js
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('✅ Notification permission granted.');
    } else {
      console.warn('❌ Notification permission denied.');
    }
  }
};

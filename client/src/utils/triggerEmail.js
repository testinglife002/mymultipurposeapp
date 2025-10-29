import newRequest from '../utils/newRequest';

const triggerEmail = async (userEmail, todo) => {
  try {
    await newRequest.post('/notify/send-email', {
      to: userEmail,
      subject: `⏰ Reminder: ${todo.title}`,
      text: `This is a reminder that your todo "${todo.title}" starts at ${new Date(todo.start).toLocaleString()}`,
    });
  } catch (err) {
    console.error('Email failed:', err);
  }
};

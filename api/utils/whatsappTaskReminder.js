// ✅ Step 1: utils/whatsappTaskReminder.js
// utils/whatsappTaskReminder.js
import twilio from "twilio";
import dotenv from "dotenv";
import dayjs from "dayjs";
import Task from "../models/task.model.js";

dotenv.config();

// ✅ Twilio setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox sender
const TEST_PHONE = "whatsapp:+8801617063739"; // ✅ Hardcoded receiver

// ✅ Send WhatsApp message
export const sendWhatsAppMessage = async (message) => {
  try {
    const msg = await client.messages.create({
      from: FROM_NUMBER,
      to: TEST_PHONE,
      body: message,
    });
    console.log("✅ WhatsApp message sent:", msg.sid);
  } catch (error) {
    console.error("❌ WhatsApp send failed:", error.message);
  }
};

// ✅ Schedule WhatsApp reminders for a task
export const scheduleTaskReminders = async (task) => {
  if (!task || !task.start) {
    console.warn("⚠️ Task has no start date, skipping reminders");
    return;
  }

  const now = new Date();
  const start = new Date(task.start);

  // Build reminder schedule
  const reminders = [
    { type: "created", time: now },
    { type: "1-day-before", time: dayjs(start).subtract(1, "day").toDate() },
    { type: "1-hour-before", time: dayjs(start).subtract(1, "hour").toDate() },
  ];

  reminders.forEach((rem) => {
    const delay = Math.max(0, rem.time - now);

    setTimeout(async () => {
      try {
        const message =
          rem.type === "created"
            ? `🆕 *New Task Created!*\n📌 ${task.title}\n📅 Start: ${dayjs(task.start).format(
                "YYYY-MM-DD HH:mm"
              )}\n⚡ Priority: ${task.priority.toUpperCase()}`
            : rem.type === "1-day-before"
            ? `⏰ Reminder: Your task *${task.title}* starts in 1 day!`
            : `⚡ Quick reminder: Your task *${task.title}* starts in 1 hour!`;

        await sendWhatsAppMessage(message); 

        // Mark as sent (optional)
        await Task.findByIdAndUpdate(task._id, {
          $push: { remindersSent: rem.type },
        });

        console.log(`✅ ${rem.type} reminder sent for task: ${task.title}`);
      } catch (err) {
        console.error(`❌ Failed to send ${rem.type} reminder:`, err.message);
      }
    }, delay);
  });
};
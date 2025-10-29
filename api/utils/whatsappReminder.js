// ✅ Step 1: utils/whatsappReminder.js

// Create a new helper file to handle Twilio WhatsApp sending and scheduling logic.

// utils/whatsappReminder.js
import mongoose from "mongoose";
import twilio from "twilio";
import dotenv from "dotenv";
import dayjs from "dayjs";
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";

dotenv.config();

// ✅ Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_WHATSAPP_FROM
);

const FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox number
const TEST_PHONE = "+8801617063739"; // ✅ Hardcoded test WhatsApp number

// ✅ Send WhatsApp message
export const sendWhatsAppMessage = async ( to, message) => {
  try {
    if (!to.startsWith("whatsapp:")) to = `whatsapp:${to}`;

    const msg = await client.messages.create({
      from: FROM_NUMBER,
      to,
      body: message,
    });

    console.log("✅ WhatsApp message sent:", msg.sid);
    return msg;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.message);
  }
};



// ✅ Schedule WhatsApp reminders
export const scheduleTodoReminders = async (todo) => {
  if (!todo?.start || !todo?.userId) return;

  // Optional: validate userId type
  let userIdGet = todo.userId;
  if (!mongoose.isValidObjectId(userIdGet)) {
    console.warn(`⚠️ Invalid userId: ${userIdGet}`);
    return;
  }
  
  const userId = mongoose.Types.ObjectId.isValid(todo.userId)
    ? todo.userId
    : new mongoose.Types.ObjectId(todo.userId);

  const userGet = await User.findById(userId).select("phone username");
  console.log("🔍 Found user:", userGet?.username || "Unknown User", "Phone:", userGet?.phone);
  // Try to fetch user (for logging only)
  const user = await User.findById(userId).select("phone username");
  console.log("🔍 Found user:", user?.username || "Unknown User");
  
  if (!user || !user.phone) {
    console.warn(`⚠️ No WhatsApp number found for userId=${userId}`);
    return;
  }

  // ✅ Always use hardcoded WhatsApp number for now
  const phoneNo = TEST_PHONE;

  const now = new Date();
  const start = new Date(todo.start);

  const reminders = [
    { type: "created", time: now },
    { type: "1-day-before", time: dayjs(start).subtract(1, "day").toDate() },
    { type: "1-hour-before", time: dayjs(start).subtract(1, "hour").toDate() },
  ];

  reminders.forEach((rem) => {
    const delay = Math.max(0, new Date(rem.time) - now);

    setTimeout(async () => {
      try {
        const message =
          rem.type === "created"
            ? `🆕 New Todo Created: *${todo.title}*\n📅 Starts: ${dayjs(todo.start).format("YYYY-MM-DD HH:mm")}`
            : rem.type === "1-day-before"
            ? `⏰ Reminder: Your todo *${todo.title}* starts in 1 day!`
            : `⚡ Reminder: Your todo *${todo.title}* starts in 1 hour!`;

        await sendWhatsAppMessage( phoneNo, message);
        // await sendWhatsAppMessage( /* "+8801617063739", */ message);

        await Todo.findByIdAndUpdate(todo._id, {
          $push: { remindersSent: rem.type },
        });

        console.log(`✅ ${rem.type} reminder sent to ${user?.username || "test user"}`);
      } catch (err) {
        console.error(`❌ Failed ${rem.type} reminder:`, err.message);
      }
    }, delay);
  });
};


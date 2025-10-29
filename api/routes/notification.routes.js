// backend/routes/notification.routes.js
import express from "express";
import Notification from "../models/notification.model.js";
import * as notificationCtrl from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// 🔹 SSE Real-Time Stream
// =====================================================

/*
router.get("/stream", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  console.log("✅ SSE client connected");

  const changeStream = Notification.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const newNotif = change.fullDocument;
      res.write(`data: ${JSON.stringify(newNotif)}\n\n`);
    }
  });

  req.on("close", () => {
    console.log("❌ SSE client disconnected");
    changeStream.close();
    res.end();
  });
});
*/



// =====================================================
// 🔹 Standard Notification REST API
// =====================================================

// Get all notifications (latest first)
router.get("/", verifyToken, notificationCtrl.getNotifications);

// Get unseen count
router.get("/unseen/count", verifyToken, notificationCtrl.getUnseenCount);

// Create a new notification
router.post("/", verifyToken, notificationCtrl.createNotification);

// Mark one as seen
router.put("/:id/seen", verifyToken, notificationCtrl.markAsSeen);

// Mark all as seen
router.put("/mark-all-seen", verifyToken, notificationCtrl.markAllAsSeen);

// Delete a notification
router.delete("/:id", verifyToken, notificationCtrl.deleteNotification);

export default router;

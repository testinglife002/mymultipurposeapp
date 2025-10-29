// components/appmaterial/NotificationsPanel.jsx
import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./NotificationsPanel.css";

export default function NotificationsPanel({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Load all notifications initially
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await newRequest.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mark all as seen
  const handleMarkAllSeen = async () => {
    try {
      await newRequest.put("/notifications/mark-all-seen");
      setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
    } catch (err) {
      console.error("❌ Failed to mark all notifications as seen:", err);
    }
  };

  // 🔹 Handle click on one notification
  const handleClickNotification = async (notif) => {
    try {
      if (!notif.isSeen) {
        await newRequest.put(`/notifications/${notif._id}/seen`);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id ? { ...n, isSeen: true } : n
          )
        );
      }
      if (notif.url) navigate(notif.url);
    } catch (err) {
      console.error("❌ Failed to handle notification click:", err);
    }
  };

  // 🔹 Auto-refresh notifications every 10 seconds
  useEffect(() => {
    if (!open) return;
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <div className={`app-mat-notifications-panel ${open ? "open" : ""}`}>
      <div className="app-mat-notifications-header">
        <h3>Notifications</h3>
        <div className="app-mat-notifications-actions">
          <button
            className="mark-all-btn"
            onClick={handleMarkAllSeen}
            title="Mark all as seen"
          >
            <FaCheckDouble />
          </button>
          <button
            className="app-mat-notifications-close"
            onClick={onClose}
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="app-mat-notifications-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`app-mat-notification-item ${n.isSeen ? "seen" : "unseen"}`}
              onClick={() => handleClickNotification(n)}
            >
              <div className="app-mat-notification-title">
                {n.message || n.title}
              </div>
              <div className="app-mat-notification-time">
                {n.timeAgo
                  ? n.timeAgo
                  : new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


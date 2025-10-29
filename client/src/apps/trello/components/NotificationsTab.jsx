import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../../api/newRequest";
import "./ActivitiesFeeds.css";

export default function NotificationsTab({ onUnseenCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      const res = await newRequest.get("/notifications");
      setNotifications(res.data);
      const count = res.data.filter((n) => !n.isSeen).length;
      setUnseenCount(count);
      if (onUnseenCountChange) onUnseenCountChange(count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
    // interval = setInterval(loadNotifications, 10000);
    // return () => clearInterval(interval);
  }, []);

  const handleMarkAllSeen = async () => {
    try {
      await newRequest.put("/notifications/mark-all-seen");
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickNotification = async (notif) => {
    try {
      if (!notif.isSeen) {
        await newRequest.put(`/notifications/${notif._id}/seen`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isSeen: true } : n))
        );
        const newCount = unseenCount - 1;
        setUnseenCount(newCount);
        if (onUnseenCountChange) onUnseenCountChange(newCount);
      }
      if (notif.url) navigate(notif.url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <span>Notifications</span>
        {unseenCount > 0 && <span className="notif-badge">{unseenCount}</span>}
        <button className="small-btn" onClick={handleMarkAllSeen}>
          Mark all seen
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-activity">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-item ${n.isSeen ? "seen" : "unseen"}`}
              onClick={() => handleClickNotification(n)}
            >
              <div className="notif-title">{n.title}</div>
              {n.message && <div className="notif-message">{n.message}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

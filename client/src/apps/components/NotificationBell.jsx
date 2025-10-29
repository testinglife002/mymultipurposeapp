import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../api/newRequest";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const loadNotifications = async () => {
    try {
      const res = await newRequest.get("/notifications");
      const data = res.data || [];
      setNotifications(data);
      setUnseenCount(data.filter((n) => !n.isSeen).length);
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Poll less frequently (e.g., every 60s instead of 10s)
    // const interval = setInterval(loadNotifications, 60000);

    // return () => clearInterval(interval);
  }, []);

  /*
  useEffect(() => {
    let retryDelay = 10000; // 10s
    let timer;

    const fetchWithBackoff = async () => {
      try {
        await loadNotifications();
        retryDelay = 10000; // reset delay on success
      } catch (err) {
        if (err.response?.status === 429) {
          console.warn("⚠️ Rate limited. Retrying later...");
          retryDelay = Math.min(retryDelay * 2, 300000); // double delay, max 5m
        }
      } finally {
        timer = setTimeout(fetchWithBackoff, retryDelay);
      }
    };

    fetchWithBackoff();
    return () => clearTimeout(timer);
  }, []);
  */

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllSeen = async () => {
    try {
      await newRequest.put("/notifications/mark-all-seen");
      setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
      setUnseenCount(0);
    } catch (err) {
      console.error("❌ Failed to mark all notifications as seen:", err);
    }
  };

  const handleClickNotification = async (notif) => {
    try {
      if (!notif.isSeen) {
        await newRequest.put(`/notifications/${notif._id}/seen`);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id ? { ...n, isSeen: true } : n
          )
        );
        setUnseenCount((c) => Math.max(c - 1, 0));
      }
      if (notif.url) navigate(notif.url);
    } catch (err) {
      console.error("❌ Failed to handle notification click:", err);
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button className="bell-button" onClick={() => setOpen((o) => !o)}>
        <Bell size={24} />
        {unseenCount > 0 && <span className="badge">{unseenCount}</span>}
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <span>Notifications</span>
            <button className="mark-all-button" onClick={handleMarkAllSeen}>
              Mark all seen
            </button>
          </div>
          <div className="dropdown-divider" />

          {notifications.length === 0 ? (
            <div className="no-notifications">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`dropdown-item ${n.isSeen ? "" : "unseen"}`}
                onClick={() => handleClickNotification(n)}
              >
                <div className="notif-title">{n.title || n.message}</div>
                {n.message && (
                  <div className="notif-message">{n.message}</div>
                )}
                <div className="notif-time">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


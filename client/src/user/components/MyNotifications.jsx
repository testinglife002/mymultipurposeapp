// src/admin/components/MyNotifications.jsx
import React from "react";
import { Bell } from "lucide-react";
import "./MyNotifications.css";

const MyNotifications = ({ notifications, markAsRead }) => {
  return (
    <div className="card">
      <div className="card-header">
        <Bell size={20} />
        <h4>Notifications</h4>
      </div>
      <div className="card-body">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notification ${n.read ? "read" : "unread"}`}>
              <p>{n.message}</p>
              {!n.read && (
                <button onClick={() => markAsRead(n.id)}>Mark as Read</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyNotifications;
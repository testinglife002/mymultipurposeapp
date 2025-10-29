// apps/taskmanager/components/NotificationPanel.jsx
import React, { useState } from "react";
import moment from "moment";
import "./NotificationPanel.css";

const mockData = [
  {
    _id: 1,
    notiType: "alert",
    text: "New task assigned to you.",
    createdAt: new Date(),
  },
  {
    _id: 2,
    notiType: "message",
    text: "Team meeting scheduled.",
    createdAt: new Date(),
  },
];

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="noti-panel">
      <button className="noti-btn" onClick={() => setOpen(!open)}>
        🔔
        {mockData.length > 0 && <span className="noti-count">{mockData.length}</span>}
      </button>

      {open && (
        <div className="noti-dropdown">
          {mockData.map((item) => (
            <div key={item._id} className="noti-item">
              <div className="noti-type">{item.notiType}</div>
              <p>{item.text}</p>
              <span>{moment(item.createdAt).fromNow()}</span>
            </div>
          ))}

          <div className="noti-actions">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button>Mark All Read</button>
          </div>
        </div>
      )}
    </div>
  );
}

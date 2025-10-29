import React, { useState, useMemo, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationsTab from "./NotificationsTab";
import "./ActivitiesFeeds.css";

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(seconds / 60) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const ActivitiesFeeds = ({ board }) => {
  const [tab, setTab] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimeout = useRef(null);
  const listRef = useRef(null);

  // Detect scrolling
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setScrolling(false), 1500);
    };

    list.addEventListener("scroll", handleScroll);
    return () => list.removeEventListener("scroll", handleScroll);
  }, []);

  const activities = useMemo(() => {
    if (!board || !board.activity) return [];
    return [...board.activity].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [board]);

  return (
    <div className="activity-container">
      <div className="activity-header">
        <h3>Activity&Notifications</h3>
        <div className="header-icons">

          <button
            className="bell-btn"
            onClick={() => setTab(1)}
            title="Notifications"
          >
            <Bell size={20} />
            {unseenCount > 0 && (
              <span className="notif-badge">{unseenCount}</span>
            )}
          </button>

        </div>
        
      </div>

      <div className="tabs">
        <button
          className={tab === 0 ? "tab active" : "tab"}
          onClick={() => setTab(0)}
        >
          ActivityFeed
        </button>
        <button
          className={tab === 1 ? "tab active" : "tab"}
          onClick={() => setTab(1)}
        >
          Notifications
        </button>
      </div>

      <div
        ref={listRef}
        className={`activity-list ${scrolling ? "show-scroll" : ""}`}
      >
        {tab === 0 ? (
          activities.length > 0 ? (
            activities.map((activity, idx) => (
              <div className="activity-item" key={activity._id || idx}>
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.user?.username || "A user"}</strong>{" "}
                    {activity.action} {activity.details}
                  </div>
                  <div className="activity-time">
                    {timeSince(activity.timestamp)}
                  </div>
                </div>
                <div className="activity-actions">
                  <button className="small-btn">✏️</button>
                  <button className="small-btn">🗑️</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">No activity recorded yet.</div>
          )
        ) : (
          <NotificationsTab onUnseenCountChange={setUnseenCount} />
        )}
      </div>
    </div>
  );
};

export default ActivitiesFeeds;


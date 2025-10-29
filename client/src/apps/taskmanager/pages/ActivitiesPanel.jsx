// src/components/ActivitiesPanel.jsx
import React, { useState } from "react";
import { MdTaskAlt } from "react-icons/md";

import "./ActivitiesPanel.css";
import Button from "../components/Button";

export default function ActivitiesPanel({ activity = [], taskId, onActivityAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddActivity = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/tasks/${taskId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity: text, type: "commented" }),
      });
      const data = await res.json();
      if (onActivityAdded) onActivityAdded(data.activities);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activities-panel">
      <div className="activities-list">
        <h4>Activities</h4>
        {activity.length ? (
          activity.map((a, i) => (
            <div key={i} className="activity-card">
              <div className="activity-icon">{a.icon || <MdTaskAlt />}</div>
              <div>
                <p>{a.by?.username || "Unknown User"}</p>
                <p>{a.type || a.activity || "No description"}</p>
                <small>{a.date ? new Date(a.date).toLocaleString() : ""}</small>
              </div>
            </div>
          ))
        ) : (
          <p>No activities yet.</p>
        )}
      </div>

      <div className="activities-add">
        <h4>Add Activity</h4>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your activity here..."
        />
        <Button
          label={loading ? "Adding..." : "Submit"}
          className="btn-primary"
          onClick={handleAddActivity}
          disabled={loading || !text.trim()}
        />
      </div>
    </div>
  );
}

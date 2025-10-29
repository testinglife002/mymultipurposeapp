// ✅ src/apps/todos/components/TodoCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import {
  CheckCircle,
  XCircle,
  List,
  Hourglass,
  PlayCircle,
  PauseCircle,
  Folder,
  Tag,
} from "lucide-react";
import { showBrowserNotification } from "../../../utils/notificationUtils";
import "./TodoCard.css";

const getStatusIcon = (status) => {
  switch (status) {
    case "done":
      return <CheckCircle className="icon success" />;
    case "in-progress":
      return <PlayCircle className="icon warning" />;
    case "pending":
      return <Hourglass className="icon secondary" />;
    case "todo":
      return <PauseCircle className="icon muted" />;
    default:
      return <XCircle className="icon danger" />;
  }
};

const TodoCard = ({ todo }) => {

  // inside TodoCard
  const navigate = useNavigate();
  const { title, start, end } = todo;
  const [timeLeft, setTimeLeft] = useState("");
  const [endLeft, setEndLeft] = useState("");
  const [shownReminders, setShownReminders] = useState([]);

  const calculateCountdown = () => {
    const now = dayjs();
    const startDiff = dayjs(start).diff(now, "second");
    const endDiff = dayjs(end).diff(now, "second");

    // Reminder triggers
    if (startDiff <= 3600 && startDiff > 0) {
      const msg = `⏰ "${title}" starts in less than an hour!`;
      toast(msg);
      showBrowserNotification("Todo Reminder ⏰", { body: msg });
    }

    if (startDiff <= 86400 && startDiff > 3600) {
      const msg = `⚠️ "${title}" starts within a day!`;
      toast(msg);
      showBrowserNotification("Todo Reminder ⚠️", { body: msg });
    }

    setTimeLeft(formatDuration(startDiff));
    setEndLeft(formatDuration(endDiff));
  };

  const formatDuration = (seconds) => {
    if (seconds <= 0) return "Started or expired";
    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hrs}h ${mins}m ${secs}s`;
  };

  useEffect(() => {
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="todo-card"
      onClick={() => navigate(`/apps/todo/${todo._id}`)}
    >
      <div className="todo-header">
        <h5>{title}</h5>
        <span className={`priority-badge ${todo.priority}`}>
          {todo.priority}
        </span>
      </div>

      <div className="todo-time">
        <span className="muted">
          Starts in: <span className="info">{timeLeft}</span>
        </span>
        <span className="muted">
          Ends in: <span className="success">{endLeft}</span>
        </span>
      </div>

      <div className="todo-status">
        <Tooltip title={`Status: ${todo.status}`}>
          <div className="status-wrapper">
            {getStatusIcon(todo.status)}
            <span className={`status-badge ${todo.status}`}>
              {todo.status}
            </span>
          </div>
        </Tooltip>

        <Tooltip title="Subtasks count">
          <div className="subtasks">
            <List className="icon primary" />
            <span>{todo.subtodos?.length || 0}</span>
          </div>
        </Tooltip>
      </div>

      <div className="meta-info">
        {todo.category && (
          <span className="meta-chip info">
            <Folder size={14} /> {todo.category}
          </span>
        )}
        {todo.listTitle && (
          <span className="meta-chip dark">
            <Tag size={14} /> {todo.listTitle}
          </span>
        )}
      </div>

      {todo.tags && todo.tags.length > 0 && (
        <div className="tags">
          {todo.tags.map((tag, idx) => (
            <span key={idx} className="tag-chip">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoCard;




// apps/taskmanager/components/BoardView.jsx
import React from "react";
import "./BoardView.css";

export default function BoardView({ tasks }) {
  const grouped = tasks.reduce((acc, task) => {
    acc[task.stage] = acc[task.stage] || [];
    acc[task.stage].push(task);
    return acc;
  }, {});

  const columns = ["todo", "in progress", "completed"];

  return (
    <div className="board-view">
      {columns.map((col) => (
        <div key={col} className="board-column">
          <div className="board-column-header">
            <h3 className="column-title">{col.toUpperCase()}</h3>
            <span className="task-count">{grouped[col]?.length || 0}</span>
          </div>
          <div className="board-tasks">
            {grouped[col]?.map((task, i) => (
              <div key={i} className="task-card">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className={`priority-tag ${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className="due-date">
                    {new Date(task.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) || <p className="no-tasks">No tasks</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

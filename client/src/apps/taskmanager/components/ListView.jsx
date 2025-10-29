// apps/taskmanager/components/ListView.jsx
import React from "react";
import "./ListView.css";

export default function ListView({ tasks }) {
  return (
    <div className="list-view">
      <table className="task-list-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Stage</th>
            <th>Priority</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={i}>
              <td>{task.title}</td>
              <td>{task.stage}</td>
              <td>
                <span className={`priority-tag ${task.priority}`}>
                  {task.priority}
                </span>
              </td>
              <td>{new Date(task.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

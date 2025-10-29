// apps/taskmanager/pages/Tasks.jsx
import React, { useState } from "react";
import BoardView from "../components/BoardView";
import ListView from "../components/ListView";
import { tasksData } from "./data"; // assume sample or fetched data
import "./Tasks.css";

export default function Tasks() {
  const [view, setView] = useState("board");

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <div className="view-toggle">
          <button
            className={view === "board" ? "active" : ""}
            onClick={() => setView("board")}
          >
            🗂 Board View
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            📋 List View
          </button>
        </div>
      </div>

      {view === "board" ? (
        <BoardView tasks={tasksData} />
      ) : (
        <ListView tasks={tasksData} />
      )}
    </div>
  );
}

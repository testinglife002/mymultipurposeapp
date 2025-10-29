// src/TodoApp.jsx
import React, { useState } from "react";

import './TodoApp.css';

// Dummy initial data
const initialProjects = [
  { id: "p1", name: "today" },
  { id: "p2", name: "work" },
  { id: "p3", name: "personal" },
];

const initialTodos = [
  { id: "t1", text: "Finish report", projectName: "work", day: "1", time: "10:00 AM", checked: false },
  { id: "t2", text: "Buy groceries", projectName: "personal", day: "2", time: "5:00 PM", checked: false },
  { id: "t3", text: "Read a book", projectName: "personal", day: "0", time: "8:00 PM", checked: false },
  { id: "t4", text: "Daily standup", projectName: "today", day: "0", time: "9:00 AM", checked: false },
];

function TodoApp() {
  const [projects, setProjects] = useState(initialProjects);
  const [todos, setTodos] = useState(initialTodos);
  const [selectedProject, setSelectedProject] = useState("today");
  const [selectedTodo, setSelectedTodo] = useState(undefined);

  return (
    <div className="TodoApp">
      {/* Sidebar */}

      {/* Main area */}
      
    </div>
  );
}

export default TodoApp;

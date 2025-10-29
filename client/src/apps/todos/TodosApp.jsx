// apps/todos/TodosApp.jsx
// apps/todos/TodosApp.jsx
// src/todos/TodosApp.jsx
import React, { useState } from "react";


// Dummy initial data
const dummyProjects = [
  { id: 1, name: "Work" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Shopping" },
];

const dummyTodos = [
  { id: 1, text: "Finish React project", day: "0", time: "10:00 AM", projectName: "Work", checked: false, color: "#FF6B6B" },
  { id: 2, text: "Buy groceries", day: "1", time: "2:00 PM", projectName: "Shopping", checked: false, color: "#4ECDC4" },
  { id: 3, text: "Call Alice", day: "2", time: "5:00 PM", projectName: "Personal", checked: true, color: "#556270" },
  { id: 4, text: "Read a book", day: "0", time: "8:00 PM", projectName: "Personal", checked: false, color: "#C7F464" },
  { id: 5, text: "Team meeting", day: "3", time: "11:00 AM", projectName: "Work", checked: false, color: "#FF6B6B" },
];

export default function TodosApp() {
  // STATE
  const [projects, setProjects] = useState(dummyProjects);
  const [todos, setTodos] = useState(dummyTodos);
  const [selectedProject, setSelectedProject] = useState("today");
  const [selectedTodo, setSelectedTodo] = useState(null);

  // Add new todo
  const handleAddTodo = (newTodo) => {
    setTodos([...todos, { ...newTodo, id: Date.now() }]);
  };

  // Update todo (EditTodo)
  const handleUpdateTodo = (updatedTodo) => {
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  // Add new project
  const handleAddProject = (newProjectName) => {
    if (!projects.some((p) => p.name === newProjectName)) {
      setProjects([...projects, { id: Date.now(), name: newProjectName }]);
    } else {
      alert("Project already exists!");
    }
  };

  return (
    <div className="TodosApp">
      {/* Sidebar */}
     

      {/* Main */}
     
    </div>
  );
}
















/*
import React, { useState } from "react";
import "./TodosApp.css";

import Sidebar from "./components/Sidebar";
import User from "./components/User";
import AddNewTodo from "./components/AddNewTodo";
import Calendar from "./components/Calendar";
import Projects from "./components/Projects";
import Todos from "./components/Todos";
import EditTodo from "./components/EditTodo";
import Next7Days from "./components/Next7Days";

// Dummy Projects
const dummyProjects = [
  { id: 1, name: "Work", numOfTodos: 3 },
  { id: 2, name: "Personal", numOfTodos: 2 },
  { id: 3, name: "Shopping", numOfTodos: 1 },
  { id: 4, name: "Fitness", numOfTodos: 0 },
];

// Dummy Todos
const dummyTodos = [
  {
    id: 1,
    text: "Finish project report",
    checked: false,
    date: "2025-09-29",
    day: "1", // Monday
    time: "10:00",
    projectName: "Work",
    color: "#ff6347",
  },
  {
    id: 2,
    text: "Call client",
    checked: true,
    date: "2025-09-30",
    day: "2", // Tuesday
    time: "14:00",
    projectName: "Work",
    color: "#0080ff",
  },
  {
    id: 3,
    text: "Buy groceries",
    checked: false,
    date: "2025-10-01",
    day: "3",
    time: "18:00",
    projectName: "Shopping",
    color: "#00ff00",
  },
  {
    id: 4,
    text: "Book flight tickets",
    checked: false,
    date: "2025-10-02",
    day: "4",
    time: "11:30",
    projectName: "Personal",
    color: "#ffa500",
  },
  {
    id: 5,
    text: "Go to gym",
    checked: false,
    date: "2025-10-03",
    day: "5",
    time: "07:00",
    projectName: "Fitness",
    color: "#800080",
  },
];

function TodosApp() {
  const [selectedProject, setSelectedProject] = useState("today");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState(dummyTodos);
  const [projects, setProjects] = useState(dummyProjects);

  // Filter todos by selected project
  const filteredTodos =
    selectedProject.toLowerCase() === "next 7 days"
      ? todos
      : todos.filter((todo) => todo.projectName === selectedProject);

  return (
    <div className="TodosApp">
    
      <div className="sidebar">
        <User />
        <AddNewTodo
          projects={projects}
          selectedProject={selectedProject}
          setTodos={setTodos}
        />
        <Calendar setSelectedProject={setSelectedProject} />
        <Projects
          projects={projects}
          setProjects={setProjects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>

      
      <div className="todo-list">
        {selectedProject.toLowerCase() === "next 7 days" ? (
          <Next7Days todos={todos} setSelectedTodo={setSelectedTodo} />
        ) : (
          <Todos
            todos={filteredTodos}
            selectedProject={selectedProject}
            setSelectedTodo={setSelectedTodo}
          />
        )}
      </div>

   
      <div className="edit-todo">
        <EditTodo
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          projects={projects}
          setTodos={setTodos}
        />
      </div>
    </div>
  );
}

export default TodosApp;
*/

/*
import React, { useState } from "react";
import "./TodosApp.css";

import Sidebar from "./components/Sidebar";
import User from "./components/User";
import AddNewTodo from "./components/AddNewTodo";
import Calendar from "./components/Calendar";
import Projects from "./components/Projects";
import Todos from "./components/Todos";
import EditTodo from "./components/EditTodo";
import Next7Days from "./components/Next7Days";

// Dummy Projects
const dummyProjects = [
  { id: 1, name: "Work", numOfTodos: 3 },
  { id: 2, name: "Personal", numOfTodos: 2 },
  { id: 3, name: "Shopping", numOfTodos: 1 },
  { id: 4, name: "Fitness", numOfTodos: 0 },
];

// Dummy Todos
const dummyTodos = [
  {
    id: 1,
    text: "Finish project report",
    checked: false,
    date: "2025-09-29",
    day: "1", // Monday
    time: "10:00",
    projectName: "Work",
    color: "#ff6347",
  },
  {
    id: 2,
    text: "Call client",
    checked: true,
    date: "2025-09-30",
    day: "2", // Tuesday
    time: "14:00",
    projectName: "Work",
    color: "#0080ff",
  },
  {
    id: 3,
    text: "Buy groceries",
    checked: false,
    date: "2025-10-01",
    day: "3",
    time: "18:00",
    projectName: "Shopping",
    color: "#00ff00",
  },
  {
    id: 4,
    text: "Book flight tickets",
    checked: false,
    date: "2025-10-02",
    day: "4",
    time: "11:30",
    projectName: "Personal",
    color: "#ffa500",
  },
  {
    id: 5,
    text: "Go to gym",
    checked: false,
    date: "2025-10-03",
    day: "5",
    time: "07:00",
    projectName: "Fitness",
    color: "#800080",
  },
];

function TodosApp() {
  const [selectedProject, setSelectedProject] = useState("Work");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState(dummyTodos);
  const [projects, setProjects] = useState(dummyProjects);

  // Filter todos by selected project
  const filteredTodos =
    selectedProject.toLowerCase() === "next 7 days"
      ? todos
      : todos.filter((todo) => todo.projectName === selectedProject);

  return (
    <div className="TodosApp">
     
      <div className="sidebar">
        <User />
        <AddNewTodo
          projects={projects}
          selectedProject={selectedProject}
          setTodos={setTodos}
        />
        <Calendar setSelectedProject={setSelectedProject} />
        <Projects
          projects={projects}
          setProjects={setProjects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>


      <div className="todo-list">
        {selectedProject.toLowerCase() === "next 7 days" ? (
          <Next7Days todos={todos} setSelectedTodo={setSelectedTodo} />
        ) : (
          <Todos
            todos={filteredTodos}
            selectedProject={selectedProject}
            setSelectedTodo={setSelectedTodo}
          />
        )}
      </div>

    
      <div className="edit-todo">
        <EditTodo
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          projects={projects}
          setTodos={setTodos}
        />
      </div>
    </div>
  );
}

export default TodosApp;
*/


// src/admin/components/TaskManager.jsx
import React, { useState, useEffect } from "react";
import { Check, Trash2, Edit, List, Grid, ChevronDown, ChevronUp } from "lucide-react";
import "./TaskManager.css";

const dummyTasks = [
  {
    id: 1,
    title: "Design Dashboard",
    subtasks: ["Wireframe UI", "Pick Color Palette", "Create Components"],
    subtaskStatus: [false, true, false],
    completed: false,
    dueDate: "2025-10-05",
    priority: "High",
  },
  {
    id: 2,
    title: "Setup API",
    subtasks: ["Define Endpoints", "Connect DB", "Test Routes"],
    subtaskStatus: [true, false, false],
    completed: false,
    dueDate: "2025-10-10",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Deploy App",
    subtasks: ["Setup Server", "CI/CD", "Monitor Logs"],
    subtaskStatus: [false, false, false],
    completed: false,
    dueDate: "2025-10-15",
    priority: "Low",
  },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const [editId, setEditId] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [collapsedTasks, setCollapsedTasks] = useState({});

  useEffect(() => setTasks(dummyTasks), []);

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const addSubtaskField = () => setSubtasks([...subtasks, ""]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: editId || Date.now(),
      title,
      subtasks,
      subtaskStatus: subtasks.map(() => false),
      completed: false,
      dueDate,
      priority,
    };
    if (editId) {
      setTasks(tasks.map(t => (t.id === editId ? newTask : t)));
      setEditId(null);
    } else {
      setTasks([newTask, ...tasks]);
    }
    setTitle("");
    setSubtasks([""]);
    setDueDate("");
    setPriority("Medium");
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setSubtasks(task.subtasks);
    setDueDate(task.dueDate);
    setPriority(task.priority);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (task) => {
    setTasks(tasks.map(t => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
  };

  const toggleSubtaskCompletion = (task, index) => {
    const updated = [...task.subtaskStatus];
    updated[index] = !updated[index];
    setTasks(tasks.map(t => (t.id === task.id ? { ...t, subtaskStatus: updated } : t)));
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "completed": return tasks.filter(t => t.completed);
      case "incomplete": return tasks.filter(t => !t.completed);
      case "high": return tasks.filter(t => t.priority === "High");
      default: return tasks;
    }
  };

  const toggleCollapse = (id) => {
    setCollapsedTasks({ ...collapsedTasks, [id]: !collapsedTasks[id] });
  };

  const priorityColors = { High: "#f87171", Medium: "#fbbf24", Low: "#60a5fa" };

  // Cross-task drag-and-drop handlers
  const onDragStart = (e, taskId, subIndex) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("subIndex", subIndex);
  };

  const onDrop = (e, targetTaskId, targetIndex) => {
    e.preventDefault();
    const sourceTaskId = Number(e.dataTransfer.getData("taskId"));
    const sourceIndex = Number(e.dataTransfer.getData("subIndex"));

    if (sourceTaskId === targetTaskId && sourceIndex === targetIndex) return;

    let sourceTask = tasks.find(t => t.id === sourceTaskId);
    let targetTask = tasks.find(t => t.id === targetTaskId);

    const movingSubtask = sourceTask.subtasks[sourceIndex];
    const movingStatus = sourceTask.subtaskStatus[sourceIndex];

    // Remove from source
    sourceTask.subtasks.splice(sourceIndex, 1);
    sourceTask.subtaskStatus.splice(sourceIndex, 1);

    // Insert into target
    targetTask.subtasks.splice(targetIndex, 0, movingSubtask);
    targetTask.subtaskStatus.splice(targetIndex, 0, movingStatus);

    // Update state
    setTasks([...tasks.map(t => {
      if (t.id === sourceTaskId) return { ...sourceTask };
      if (t.id === targetTaskId) return { ...targetTask };
      return t;
    })]);
  };

  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="task-manager-container">
      <h1 className="tm-title">Task Manager</h1>

      {/* Task Form */}
      <div className="tm-form-section">
        <form className="tm-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Task" : "Add New Task"}</h2>
          <label>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="tm-input"
          />
          {subtasks.map((sub, i) => (
            <div key={i} className="tm-subtask-field">
              <label>Subtask {i + 1}</label>
              <input
                type="text"
                value={sub}
                onChange={(e) => handleSubtaskChange(i, e.target.value)}
                className="tm-input"
              />
            </div>
          ))}
          <button type="button" className="tm-btn tm-btn-outline" onClick={addSubtaskField}>
            + Add Subtask
          </button>
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="tm-input" />
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="tm-input">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit" className="tm-btn tm-btn-success">{editId ? "Update Task" : "Add Task"}</button>
        </form>
      </div>

      {/* Filter & View Toggle */}
      <div className="tm-filter-view">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="tm-input tm-filter">
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="high">High Priority</option>
        </select>
        <div className="tm-view-toggle">
          <button className={`tm-icon-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
            <List size={18} />
          </button>
          <button className={`tm-icon-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className={`tm-tasks ${viewMode}`}>
        {getFilteredTasks().map((task) => (
          <div key={task.id} className="tm-task-card">
            <div className="tm-task-header">
              <div onClick={() => toggleCollapse(task.id)} style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task)}
                />
                <span className={task.completed ? "completed" : ""}>{task.title}</span>
                <span className="tm-badge" style={{ background: priorityColors[task.priority], transition: "all 0.3s ease" }}>
                  {task.priority}
                </span>
                {task.dueDate && <span className="tm-badge due">Due: {task.dueDate}</span>}
                {task.completed && <span className="tm-badge done">Done</span>}
                {collapsedTasks[task.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <div className="tm-task-actions">
                <button onClick={() => handleEdit(task)} className="tm-icon-btn"><Edit size={16} /></button>
                <button onClick={() => handleDelete(task.id)} className="tm-icon-btn"><Trash2 size={16} /></button>
              </div>
            </div>

            {!collapsedTasks[task.id] && (
              <div className="tm-subtasks">
                {task.subtasks.map((sub, i) => (
                  <div
                    key={`${task.id}-${i}`}
                    className="tm-subtask"
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id, i)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, task.id, i)}
                    data-index={i}
                  >
                    <input
                      type="checkbox"
                      checked={task.subtaskStatus[i]}
                      onChange={() => toggleSubtaskCompletion(task, i)}
                    />
                    <span className={task.subtaskStatus[i] ? "completed" : ""}>{sub}</span>
                    <Check size={14} className="drag-icon" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;


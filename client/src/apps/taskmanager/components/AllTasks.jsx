// AllTasks.jsx
import React, { useState, useRef, useEffect } from "react";
import { Paper, Button } from "@mui/material";
import AddNewTaskModal from "./AddNewTaskModal";
import newRequest from "../../../api/newRequest";
import "./AllTasks.css";

const AllTasks = ({ selectedProject, tasks, setTasks }) => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await newRequest.get("/users/allusers");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const copyTasks = [...tasks];
    const dragItemContent = copyTasks[dragItem.current];
    copyTasks.splice(dragItem.current, 1);
    copyTasks.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(copyTasks);
  };

  return (
    <div className="all-tasks-container">
      <h4 className="all-tasks-title">
        {selectedProject ? `Tasks for ${selectedProject}` : "Select a project"}
      </h4>

      <div className="tasks-list">
        {tasks.map((task, index) => (
          <Paper
            key={index}
            className="task-card"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDrop}
            elevation={2}
          >
            <div className="task-card-body">{task}</div>
          </Paper>
        ))}
      </div>

      <div className="add-task-section">
        <h2 className="task-manager-title">Task Manager</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShow(true)}
        >
          + Add Task
        </Button>
        <AddNewTaskModal
          show={show}
          onHide={() => setShow(false)}
          allUsers={users}
        />
      </div>
    </div>
  );
};

export default AllTasks;

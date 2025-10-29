// TaskLayout.jsx
// TaskLayout.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import newRequest from "../../api/newRequest";
import "./TaskLayout.css"; // custom styling
import AppNavbar from "./components/AppNavbar";
import Sidebar from "./components/Sidebar";
import AddTaskModal from "./components/AddTaskModal";
import AddNewTaskModal from "./components/AddNewTaskModal";
import AllTasks from "./components/AllTasks";
import AddProjectModal from "./components/AddProjectModal";
import TaskSidebar from "./components/TaskSidebar";
import TaskHeader from "./components/TaskHeader";

const TaskLayout = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState(["Project Alpha", "Project Beta"]);
  const [tasks, setTasks] = useState({
    "Project Alpha": ["Task 1", "Task 2"],
    "Project Beta": ["Task 3"],
  });
  const [selectedProject, setSelectedProject] = useState(null);

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [onTaskModal, setOnTaskModal] = useState(false);

  const handleAddProject = (projectName) => {
    setProjects([...projects, projectName]);
    setTasks({ ...tasks, [projectName]: [] });
  };

  const handleAddTask = (projectName, taskName) => {
    setTasks({
      ...tasks,
      [projectName]: [...(tasks[projectName] || []), taskName],
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await newRequest.get("/users");
        console.log("Fetched users:", JSON.stringify(res.data, null, 2));
        // should now show username
        setUsers(res.data);

      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);


  return (
    <>
      {/* Navbar */}
      <AppNavbar
        showAddProjectModal={() => setShowProjectModal(true)}
        showAddTaskModal={() => setShowTaskModal(true)}
      />

      {/* Action Buttons */}
      <div className="task-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={() =>  setShowTaskModal(true)}
        >
          + Add Task
        </Button>  
      </div>

      <TaskHeader />

      {/* Main Layout */}
      <div className="task-layout">
        {/*<Sidebar user={user} /> */}
        <TaskSidebar user={user} />
        <div className="task-main">
          <AllTasks
            selectedProject={selectedProject}
            tasks={tasks[selectedProject] || []}
            setTasks={(updatedTasks) =>
              setTasks({ ...tasks, [selectedProject]: updatedTasks })
            }
          />
        </div>
      </div>

      {/* Project Modal */}
      <AddProjectModal
        show={showProjectModal}
        handleClose={() => setShowProjectModal(false)}
        onAdd={handleAddProject}
      />

      {/* Task Modal */}
      <AddTaskModal
        show={showTaskModal}
        handleClose={() => setShowTaskModal(false)}
        users={users}
        onAdd={handleAddTask}
        selectedProject={selectedProject}
      />
    </>
  );
};

export default TaskLayout;


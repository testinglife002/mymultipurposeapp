import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  GridView,
  TableRows,
  ViewKanban,
  FormatListBulleted,
  Visibility,
} from "@mui/icons-material";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import newRequest from "../../../api/newRequest";
import AddTask from "./AddTask";
import Title from "./Title";
import TaskDetailsModal from "./TaskDetailsModal";
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  // 🔹 Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await newRequest.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Fetch tasks failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await newRequest.get("/users");
      setAllUsers(res.data.users || res.data || []);
    } catch (err) {
      console.error("❌ Fetch users failed:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // 🔹 Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task permanently?")) return;
    try {
      await newRequest.delete(`/tasks/delete/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("❌ Delete task error:", err);
      alert("Failed to delete task.");
    }
  };

  // 🔹 Update task
  const updateTask = async (taskId, updatedData) => {
    try {
      const res = await newRequest.put(`/tasks/update/${taskId}`, updatedData);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
      setSelectedTask(res.data.task);
      alert("Task updated successfully.");
    } catch (err) {
      console.error("❌ Update task error:", err);
      alert("Failed to update task.");
    }
  };

  // 🔹 Group tasks by stage
  const stages = ["TODO", "IN PROGRESS", "COMPLETED"];
  const tasksByStage = stages.map((stage) => ({
    stage,
    tasks: tasks.filter((t) => t.stage?.toUpperCase() === stage),
  }));

  // 🔹 TaskCard Component
  const TaskCard = ({ task }) => (
    <Card
      className="task-card"
      onClick={() => setSelectedTask(task)} // 🟩 open modal on click
      elevation={2}
    >
      <CardContent>
        <Typography variant="h6" className="task-title">
          {task.title}
        </Typography>
        <div className="task-meta">
          <Chip
            size="small"
            label={task.priority?.toUpperCase()}
            className={`badge badge-${task.priority?.toLowerCase()}`}
          />
          <Chip
            size="small"
            label={task.stage?.toUpperCase()}
            className="badge badge-stage"
          />
        </div>
        {task.team?.length > 0 && (
          <Typography variant="body2" className="task-team">
            👥 {task.team.map((u) => u.username || u.name).join(", ")}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        {/* 🟦 View Route Button */}
        <Button
          color="primary"
          startIcon={<Visibility />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/apps/task-manager/task/${task._id}`);
          }}
        >
          View
        </Button>

        {/* 🟥 Delete Button */}
        <Button
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(task._id);
          }}
          startIcon={<MdDelete />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container className="tasks-container">
      {/* 🔹 Header */}
      <div className="tasks-header">
        <Title title="All Tasks" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<IoMdAddCircleOutline />}
          onClick={() => setOpenAdd(true)}
        >
          Create Task
        </Button>
      </div>

      {/* 🔹 View Toggle */}
      <div className="tasks-toggle">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, val) => val && setView(val)}
        >
          <ToggleButton value="board">
            <ViewKanban />
          </ToggleButton>
          <ToggleButton value="list">
            <FormatListBulleted />
          </ToggleButton>
          <ToggleButton value="grid">
            <GridView />
          </ToggleButton>
          <ToggleButton value="table">
            <TableRows />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* 🔹 Display Views */}
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : tasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        <>
          {/* 🧩 Board View */}
          {view === "board" && (
            <div className="board-view">
              {tasksByStage.map((col) => (
                <div key={col.stage} className="board-column">
                  <Typography variant="subtitle1" className="board-title">
                    {col.stage}
                  </Typography>
                  <Divider />
                  {col.tasks.length > 0 ? (
                    col.tasks.map((task) => (
                      <TaskCard key={task._id} task={task} />
                    ))
                  ) : (
                    <Typography variant="body2" className="empty-col">
                      No tasks
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 🧩 Grid View */}
          {view === "grid" && (
            <Grid container spacing={2}>
              {tasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task._id}>
                  <TaskCard task={task} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* 🧩 List View */}
          {view === "list" && (
            <div className="list-view">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="list-item"
                  onClick={() => setSelectedTask(task)}
                >
                  <Typography variant="h6">{task.title}</Typography>
                  <div className="list-meta">
                    <Chip
                      label={task.priority}
                      size="small"
                      className={`badge-${task.priority?.toLowerCase()}`}
                    />
                    <Chip
                      label={task.stage}
                      size="small"
                      className="badge-stage"
                    />
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/apps/task-manager/task/${task._id}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🧩 Table View */}
          {view === "table" && (
            <Table className="table-view">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Stage</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task._id}
                    hover
                    onClick={() => setSelectedTask(task)}
                  >
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.stage}</TableCell>
                    <TableCell>
                      {task.team?.map((u) => u.username).join(", ")}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/apps/task-manager/task/${task._id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}

      {/* 🔹 Add Task Modal */}
      <AddTask
        open={openAdd}
        setOpen={setOpenAdd}
        users={allUsers}
        refresh={fetchTasks}
        fetchTasks={fetchTasks}
      />

      {/* 🔹 Task Details Modal (on card/list/table click) */}
      <TaskDetailsModal
        show={!!selectedTask}
        task={selectedTask}
        users={allUsers}
        projects={projects}
        onHide={() => setSelectedTask(null)}
        onUpdate={updateTask}
      />
    </Container>
  );
};

export default Tasks;


/*
import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  GridView,
  ViewList,
  TableRows,
  ViewKanban,
  FormatListBulleted,
} from "@mui/icons-material";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

import newRequest from "../../../api/newRequest";
import AddTask from "./AddTask";
import Title from "./Title";
import TaskCard from "./TaskCard";
import TaskDetailsModal from "./TaskDetailsModal";

import "./Tasks.css";

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("board");
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);

  const { status } = useParams();

  const fetchTasks = async () => {
    try {
      const res = await newRequest.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await newRequest.delete(`/tasks/delete/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task");
    }
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

  const renderCardView = () => (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
          <Card
            className="task-card"
            onClick={() => setSelectedTask(task)}
          >
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <div className="task-badges">
                <Chip
                  label={task.priority}
                  className={`badge-${task.priority}`}
                  size="small"
                />
                <Chip label={task.stage} size="small" className="badge-stage" />
              </div>
              {task.team?.length > 0 && (
                <div className="task-team">
                  {task.team.map((user) => (
                    <Chip
                      key={user._id}
                      label={user.username || user.name}
                      size="small"
                      className="badge-info"
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task._id);
                }}
                startIcon={<MdDelete />}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <Table className="task-table">
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Stage</TableCell>
          <TableCell>Users</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow
            key={task._id}
            hover
            onClick={() => setSelectedTask(task)}
            style={{ cursor: "pointer" }}
          >
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <Chip
                label={task.priority}
                className={`badge-${task.priority}`}
                size="small"
              />
            </TableCell>
            <TableCell>
              <Chip label={task.stage} className="badge-stage" size="small" />
            </TableCell>
            <TableCell>
              {task.team?.map((user) => (
                <Chip
                  key={user._id}
                  label={user.username || user.name}
                  size="small"
                  className="badge-info"
                />
              ))}
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task._id);
                }}
              >
                <MdDelete />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Container className="tasks-container">
      <div className="tasks-header">
        <Title title={status ? `${status} Tasks` : "All Tasks"} />
        {!status && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            startIcon={<IoMdAddCircleOutline />}
          >
            Create Task
          </Button>
        )}
      </div>

      <div className="tasks-toggle">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, val) => val && setView(val)}
        >
          <ToggleButton value="board"><ViewKanban /></ToggleButton>
          <ToggleButton value="list"><FormatListBulleted /></ToggleButton>
          <ToggleButton value="grid"><GridView /></ToggleButton>
          <ToggleButton value="table"><TableRows /></ToggleButton>
        </ToggleButtonGroup>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <>
          {view === "board" && (
            <Grid container spacing={2}>
              {tasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task._id}>
                  <TaskCard task={task} />
                </Grid>
              ))}
            </Grid>
          )}
          {view === "list" && renderCardView()}
          {view === "grid" && renderCardView()}
          {view === "table" && renderTableView()}
        </>
      )}

      <AddTask open={open} setOpen={setOpen} refresh={fetchTasks} users={users} />

      <TaskDetailsModal
        show={!!selectedTask}
        onHide={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={(updatedTask) => {
          setTasks((prev) =>
            prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
          );
        }}
      />
    </Container>
  );
};

export default Tasks;
*/



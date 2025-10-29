// apps/taskmanager/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { User, Clipboard } from "lucide-react";
import newRequest from "../../../api/newRequest";
// import { getInitials } from "../../../utils";
import "./Users.css";
import ConfirmatioDialog from "../components/ConfirmatioDialog";


// ✅ Safer getInitials helper
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await newRequest.get("/users");
      setUsers(res.data.users || res.data || []);
    } catch (err) {
      console.error("❌ Fetch users failed:", err);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await newRequest.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Fetch tasks failed:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchTasks()]).finally(() => setLoading(false));
  }, []);

  // Delete user
  const handleDeleteUser = async () => {
    try {
      await newRequest.delete(`/users/delete/${selectedUser}`);
      setUsers((prev) => prev.filter((u) => u._id !== selectedUser));
      setOpenConfirm(false);
    } catch (err) {
      console.error("❌ Delete user failed:", err);
      alert("Failed to delete user.");
    }
  };

  // Assign task to user
  const handleAssignTask = async (userId) => {
    if (!selectedTask) return alert("Select a task first!");
    try {
      await newRequest.put(`/tasks/assign/${selectedTask}`, { userId });
      alert("Task assigned successfully!");
      setSelectedTask("");
    } catch (err) {
      console.error("❌ Assign task failed:", err);
      alert("Failed to assign task.");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Team Members</h2>
        <button className="add-user-btn" onClick={() => setOpenAddUser(true)}>
          <IoMdAdd className="icon" /> Add User
        </button>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Assign Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="user-name">
                  <div className="avatar">
                    {getInitials(user.username)}
                  </div>
                  {user.username}
                </td>
                <td>{user.title || "-"}</td>
                <td>{user.email || "-"}</td>
                <td>{user.role || "-"}</td>
                <td>
                  <span className={`status ${user.isActive ? "active" : "disabled"}`}>
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                  >
                    <option value="">Select Task</option>
                    {tasks.map((task) => (
                      <option key={task._id} value={task._id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className="assign-btn"
                    onClick={() => handleAssignTask(user._id)}
                  >
                    Assign
                  </button>
                </td>
                <td className="actions">
                  <MdEdit
                    className="edit-icon"
                    onClick={() => setOpenAddUser(user)}
                  />
                  <MdDelete
                    className="delete-icon"
                    onClick={() => {
                      setSelectedUser(user._id);
                      setOpenConfirm(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

 

      {openConfirm && (
        <ConfirmatioDialog
          open={openConfirm}
          setOpen={setOpenConfirm}
          onClick={handleDeleteUser}
          msg="Are you sure you want to delete this user?"
        />
      )}
    </div>
  );
};

export default Users;


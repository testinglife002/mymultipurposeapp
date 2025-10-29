// apps/taskmanager/pages/Dashboard.jsx
// 1️⃣ Dashboard.jsx (load summary and last tasks/users)
// apps/taskmanager/pages/Dashboard.jsx
// ✅ Final Version — apps/taskmanager/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlinePerson,
} from "react-icons/md";
import { FaNewspaper, FaArrowsToDot } from "react-icons/fa6";
import { LucideClipboardEdit } from "lucide-react";
import moment from "moment";
import newRequest from "../../../api/newRequest";
import { PRIOTITYSTYELS, TASK_TYPE } from "./data";
import "./Dashboard.css";
import { BGS } from "../../../utils";

// ✅ Safer getInitials helper
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  return (
    <div className="task-table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Priority</th>
            <th>Team</th>
            <th className="hide-mobile">Created At</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task?._id || Math.random()}>
                {/* --- Task Title --- */}
                <td>
                  <div className="task-title-cell">
                    <div
                      className={`task-dot ${TASK_TYPE[task?.stage] || ""}`}
                    />
                    <p>{task?.title || "Untitled Task"}</p>
                  </div>
                </td>

                {/* --- Priority --- */}
                <td>
                  <div className="priority-cell">
                    <span
                      className={`priority-icon ${
                        PRIOTITYSTYELS[task?.priority] || "priority-default"
                      }`}
                    >
                      {ICONS[task?.priority] || <MdKeyboardArrowRight />}
                    </span>
                    <span className="capitalize">
                      {task?.priority ? task.priority : "none"}
                    </span>
                  </div>
                </td>

                {/* --- Team --- */}
                <td>
                  <div className="team-avatars">
                    {Array.isArray(task?.team) && task.team.length > 0 ? (
                      task.team.map((m, i) => {
                        const initials = getInitials(m?.name || "");
                        return (
                          <div
                            key={i}
                            className={`avatar ${BGS[i % BGS.length]}`}
                            title={m?.name || "Unknown Member"}
                          >
                            {initials || <MdOutlinePerson />}
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className={`avatar ${BGS[0]}`}
                        title="No Team Assigned"
                      >
                        <MdOutlinePerson />
                      </div>
                    )}
                  </div>
                </td>

                {/* --- Date --- */}
                <td className="hide-mobile">
                  {task?.date ? moment(task.date).fromNow() : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- User Table ---
// --- User Table (updated to match new User model) ---
const UserTable = ({ users }) => (
  <div className="user-table-container">
    <table className="user-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Verified</th>
          <th className="hide-mobile">Country</th>
          <th className="hide-mobile">Phone</th>
          <th className="hide-mobile">Joined</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user, index) => {
            const initials = getInitials(user?.username || "");
            const hasImage = !!user?.img;
            return (
              <tr key={user?._id || index}>
                {/* --- User Info --- */}
                <td>
                  <div className="user-info-cell">
                    <div
                      className={`user-avatar ${BGS[index % BGS.length]}`}
                      title={user?.username || "Unnamed"}
                    >
                      {hasImage ? (
                        <img
                          src={user.img}
                          alt={user.username}
                          className="avatar-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.textContent = initials;
                          }}
                        />
                      ) : (
                        initials || <MdOutlinePerson />
                      )}
                    </div>
                    <div>
                      <p className="user-name">
                        {user?.username || "Unnamed"}
                      </p>
                      <span className="role-text">
                        {user?.role || "user"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* --- Email --- */}
                <td>
                  <span>{user?.email || "-"}</span>
                </td>

                {/* --- Role --- */}
                <td className="capitalize">{user?.role || "user"}</td>

                {/* --- Active Status --- */}
                <td>
                  <span
                    className={`status-badge ${
                      user?.isActive ? "active" : "disabled"
                    }`}
                  >
                    {user?.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                {/* --- Verified --- */}
                <td>
                  <span
                    className={`verify-badge ${
                      user?.isVerified ? "verified" : "unverified"
                    }`}
                  >
                    {user?.isVerified ? "Verified" : "Unverified"}
                  </span>
                </td>

                {/* --- Country --- */}
                <td className="hide-mobile">
                  {user?.country || "-"}
                </td>

                {/* --- Phone --- */}
                <td className="hide-mobile">
                  {user?.phone || "-"}
                </td>

                {/* --- Joined --- */}
                <td className="hide-mobile">
                  {user?.createdAt
                    ? moment(user.createdAt).fromNow()
                    : "-"}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={8} style={{ textAlign: "center" }}>
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await newRequest.get("/tasks");
        const usersRes = await newRequest.get("/users");
        setTasks(tasksRes?.data?.tasks || []);
        setUsers(usersRes?.data?.users || usersRes?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totals = {
    todo: tasks.filter((t) => t?.stage === "todo").length,
    "in progress": tasks.filter((t) => t?.stage === "in progress").length,
    completed: tasks.filter((t) => t?.stage === "completed").length,
  };

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: tasks.length,
      icon: <FaNewspaper />,
      bg: "bg-blue",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: totals.completed,
      icon: <MdAdminPanelSettings />,
      bg: "bg-green",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: totals["in progress"],
      icon: <LucideClipboardEdit />,
      bg: "bg-yellow",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals.todo,
      icon: <FaArrowsToDot />,
      bg: "bg-pink",
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map(({ icon, bg, label, total }, index) => (
          <div key={index} className={`stat-card ${bg}`}>
            <div className="stat-info">
              <p className="stat-label">{label}</p>
              <span className="stat-total">{total}</span>
              <span className="stat-subtext">110 last month</span>
            </div>
            <div className="stat-icon">{icon}</div>
          </div>
        ))}
      </div>

      <div className="tables-section">
        <TaskTable tasks={tasks.slice(-10)} />
        <UserTable users={users} />
      </div>
    </div>
  );
};

export default Dashboard;


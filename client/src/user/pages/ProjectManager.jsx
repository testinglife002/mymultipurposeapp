// admin/pages/ProjectManager.jsx
// src/user/pages/ProjectManager.jsx
// ✅ src/admin/pages/ProjectManager.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import Select from "react-select";
import "./ProjectManager.css";

const ProjectManager = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [shareUsers, setShareUsers] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // Modal state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showAppsModal, setShowAppsModal] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState("notes");

  // Editing states
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editingApp, setEditingApp] = useState(null);
  const [editAppName, setEditAppName] = useState("");

  // --- API calls ---
  const fetchProjects = async () => {
    if (!user) return;
    const res = await newRequest.get("/projects");
    const filtered = res.data.projects.filter(
      (p) =>
        p.owner?._id === user._id ||
        p.sharedWith?.some((u) => u._id === user._id)
    );
    setProjects(filtered);
  };

  const fetchApps = async (projectId) => {
    const res = await newRequest.get(`/apps/project/${projectId}`);
    setApps(res.data);
  };

  const fetchUsers = async () => {
    const res = await newRequest.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    if (!user) return;
    fetchProjects();
    fetchUsers();
  }, [user]);

  console.log(user)

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchApps(project._id);
    setShowAppsModal(true);
  };

  // --- CRUD ---
  const addProject = async () => {
    if (!projectName) return;
    const res = await newRequest.post("/projects", { name: projectName });
    setProjects([...projects, res.data]);
    setProjectName("");
    setShowAddProjectModal(false);
  };

  const saveProject = async (id) => {
    const res = await newRequest.patch(`/projects/${id}`, { name: editName });
    setProjects(projects.map((p) => (p._id === id ? res.data : p)));
    setEditingProject(null);
    setEditName("");
  };

  const deleteProject = async (id) => {
    await newRequest.delete(`/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
    if (selectedProject && selectedProject._id === id) {
      setSelectedProject(null);
      setApps([]);
    }
  };

  const addApp = async () => {
    if (!selectedProject || !appName) return;
    const res = await newRequest.post("/apps", {
      projectId: selectedProject._id,
      name: appName,
      type: appType,
    });
    setApps([...apps, res.data]);
    setAppName("");
    setShowAddAppModal(false);
  };

  const saveApp = async (id) => {
    const res = await newRequest.patch(`/apps/${id}`, { name: editAppName });
    setApps(apps.map((a) => (a._id === id ? res.data : a)));
    setEditingApp(null);
    setEditAppName("");
  };

  const deleteApp = async (id) => {
    await newRequest.delete(`/apps/${id}`);
    setApps(apps.filter((a) => a._id !== id));
  };

  const shareProject = async () => {
    if (!selectedProject || shareUsers.length === 0) return;
    await newRequest.post("/projects/share", {
      projectId: selectedProject._id,
      userIds: shareUsers.map((u) => u.value),
    });
    alert("Project shared!");
    setShareUsers([]);
  };

  return (
    <div className="project-manager">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Projects</h3>
        <button onClick={() => setShowAddProjectModal(true)}>+ Add Project</button>

        <div className="view-toggle">
          {["grid", "list", "table"].map((mode) => (
            <button
              key={mode}
              className={viewMode === mode ? "active" : ""}
              onClick={() => setViewMode(mode)}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Projects List */}
        {viewMode === "table" ? (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Shared</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} onClick={() => handleProjectSelect(p)}>
                  <td>
                    {editingProject === p._id ? (
                        <input
                        className="inline-edit-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => saveProject(p._id)}
                        autoFocus
                        />
                    ) : (
                        <h4>{p.name}</h4>
                    )}
                  </td>
                  <td>{p.owner?.email || "You"}</td>
                  <td>{p.sharedWith?.length || 0}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(p._id);
                        setEditName(p.name);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(p._id);
                      }}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={`projects ${viewMode}`}>
            {projects.map((p) => (
              <div
                key={p._id}
                className="project-card"
                onClick={() => handleProjectSelect(p)}
                >
                {editingProject === p._id ? (
                    <input
                    className="inline-edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => saveProject(p._id)}
                    autoFocus
                    />
                ) : (
                    <h4>{p.name}</h4>
                )}
                <div className="actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProject(p._id);
                      setEditName(p.name);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(p._id);
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="modal-overlay" onClick={() => setShowAddProjectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Project</h3>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
            />
            <button onClick={addProject}>Add</button>
            <button onClick={() => setShowAddProjectModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Apps Modal */}
      {showAppsModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowAppsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Apps in {selectedProject.name}</h3>
            <button onClick={() => setShowAddAppModal(true)}>+ Add App</button>

            <ul>
              {apps.map((app) => (
                <li key={app._id}>
                  {app.name} ({app.type})
                  <div className="actions">
                    <button
                      onClick={() => {
                        setEditingApp(app._id);
                        setEditAppName(app.name);
                      }}
                    >
                      ✏️
                    </button>
                    <button onClick={() => deleteApp(app._id)}>🗑</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="share-section">
              <h4>Share with users</h4>
              <Select
                isMulti
                options={users.map((u) => ({ value: u._id, label: u.email }))}
                value={shareUsers}
                onChange={setShareUsers}
              />
              <button onClick={shareProject}>Share</button>
            </div>

            <button onClick={() => setShowAppsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Add App Modal */}
      {showAddAppModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowAddAppModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add App to {selectedProject.name}</h3>
            <input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="App Name"
            />
            <select value={appType} onChange={(e) => setAppType(e.target.value)}>
              <option value="notes">Notes</option>
              <option value="todos">Todos</option>
              <option value="task_manager">Task Manager</option>
              <option value="trello">Trello</option>
              <option value="canva">Canva</option>
            </select>
            <button onClick={addApp}>Add</button>
            <button onClick={() => setShowAddAppModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;

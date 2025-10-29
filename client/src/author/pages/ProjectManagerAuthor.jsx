// src/author/pages/ProjectManagerAuthor.jsx
// src/components/ProjectManagerAuthor.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import "./ProjectManagerAuthor.css";

const ProjectManagerAuthor = () => {
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState("grid");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [editingAppId, setEditingAppId] = useState(null);
  const [appName, setAppName] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [shareUsers, setShareUsers] = useState([]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await newRequest.get("/users");
        setAllUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // ----------------------------
  // PROJECT CRUD
  // ----------------------------
  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    try {
      const res = await newRequest.post("/projects", { name: projectName });
      setProjects([...projects, res.data]);
      setProjectName("");
      setNewProjectModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async (id, name) => {
    try {
      const res = await newRequest.put(`/projects/${id}`, { name });
      setProjects(projects.map((p) => (p._id === id ? res.data : p)));
      setEditingProjectId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await newRequest.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------
  // APP CRUD
  // ----------------------------
  const handleCreateApp = async (projectId, name) => {
    if (!name.trim()) return;
    try {
      const res = await newRequest.post(`/apps`, { projectId, name });
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, apps: [...p.apps, res.data] } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateApp = async (projectId, appId, name) => {
    try {
      const res = await newRequest.put(`/apps/${appId}`, { name });
      setProjects(
        projects.map((p) =>
          p._id === projectId
            ? {
                ...p,
                apps: p.apps.map((a) => (a._id === appId ? res.data : a)),
              }
            : p
        )
      );
      setEditingAppId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApp = async (projectId, appId) => {
    try {
      await newRequest.delete(`/apps/${appId}`);
      setProjects(
        projects.map((p) =>
          p._id === projectId
            ? { ...p, apps: p.apps.filter((a) => a._id !== appId) }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------
  // Keyboard handler
  // ----------------------------
  const handleKeyDown = (e, saveFn, cancelFn) => {
    if (e.key === "Enter") saveFn();
    if (e.key === "Escape") cancelFn();
  };

  // ----------------------------
  // Share with users
  // ----------------------------
  const handleShareProject = async () => {
    if (!selectedProject) return;
    try {
      await newRequest.post(`/projects/${selectedProject._id}/share`, {
        users: shareUsers,
      });
      alert("Project shared!");
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  const renderProjects = () => (
    <div className={`projects-container ${view}`}>
      {projects.map((p) => (
        <div key={p._id} className="project-card">
          {editingProjectId === p._id ? (
            <input
              className="inline-input"
              value={p.name}
              onChange={(e) =>
                setProjects(
                  projects.map((proj) =>
                    proj._id === p._id ? { ...proj, name: e.target.value } : proj
                  )
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  () => handleUpdateProject(p._id, p.name),
                  () => setEditingProjectId(null)
                )
              }
              autoFocus
            />
          ) : (
            <h3 onDoubleClick={() => setEditingProjectId(p._id)}>{p.name}</h3>
          )}
          <div className="project-actions">
            <button onClick={() => setEditingProjectId(p._id)}>✏️</button>
            <button onClick={() => handleDeleteProject(p._id)}>🗑️</button>
            <button onClick={() => setSelectedProject(p)}>📂 Apps</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAppsModal = () => {
    if (!selectedProject) return null;
    return (
      <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>{selectedProject.name} - Apps</h2>

          {/* Share section */}
          <div className="share-section">
            <label>Share with users:</label>
            <div className="multi-select">
              {allUsers.map((u) => (
                <div
                  key={u._id}
                  className={`multi-option ${
                    shareUsers.includes(u._id) ? "selected" : ""
                  }`}
                  onClick={() =>
                    setShareUsers((prev) =>
                      prev.includes(u._id)
                        ? prev.filter((id) => id !== u._id)
                        : [...prev, u._id]
                    )
                  }
                >
                  {u.email}
                </div>
              ))}
            </div>
            <button className="share-btn" onClick={handleShareProject}>
              Share
            </button>
          </div>

          <div className="apps-list">
            {selectedProject.apps.map((app) =>
              editingAppId === app._id ? (
                <input
                  key={app._id}
                  className="inline-input"
                  value={app.name}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      apps: selectedProject.apps.map((a) =>
                        a._id === app._id ? { ...a, name: e.target.value } : a
                      ),
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      () => handleUpdateApp(selectedProject._id, app._id, app.name),
                      () => setEditingAppId(null)
                    )
                  }
                  autoFocus
                />
              ) : (
                <div key={app._id} className="app-row">
                  <span onDoubleClick={() => setEditingAppId(app._id)}>
                    {app.name}
                  </span>
                  <div className="app-actions">
                    <button onClick={() => setEditingAppId(app._id)}>✏️</button>
                    <button
                      onClick={() => handleDeleteApp(selectedProject._id, app._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="new-app">
            <input
              placeholder="New app name..."
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <button
              onClick={() => {
                handleCreateApp(selectedProject._id, appName);
                setAppName("");
              }}
            >
              ➕
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="project-manager">
      <div className="header">
        <h1>Project Manager</h1>
        <div className="view-toggle">
          <button onClick={() => setView("grid")}>🔲 Grid</button>
          <button onClick={() => setView("list")}>📋 List</button>
          <button onClick={() => setView("table")}>📑 Table</button>
        </div>
        <button className="add-project-btn" onClick={() => setNewProjectModal(true)}>
          ➕ New Project
        </button>
      </div>

      {renderProjects()}
      {renderAppsModal()}

      {/* New Project Modal */}
      {newProjectModal && (
        <div className="modal-overlay" onClick={() => setNewProjectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Project</h2>
            <input
              placeholder="Project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className="modal-actions">
              <button className="primary" onClick={handleCreateProject}>
                Create
              </button>
              <button onClick={() => setNewProjectModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerAuthor;




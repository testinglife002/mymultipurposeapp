// admin/pages/ProjectManager.jsx
// src/admin/pages/ProjectManager.jsx
// src/author/pages/ProjectManager.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import Select from "react-select";
import "./ProjectManager.css";

const ProjectManager = ({user}) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [apps, setApps] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState("notes");
  const [users, setUsers] = useState([]);
  const [shareUsers, setShareUsers] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // Editing states
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editingApp, setEditingApp] = useState(null);
  const [editAppName, setEditAppName] = useState("");

  // --- API calls ---
  const fetchProjects = async () => {
    if (!user) return; // don't fetch if user null

    const res = await newRequest.get("/projects");
    setProjects(res.data.projects);

    const filtered = res.data.projects.filter(
        (p) =>
        p.owner?._id === user._id ||
        p.sharedWith?.some((u) => u._id === user._id)
    );

    // setProjects(filtered);
  };
  
  console.log(projects)


  const fetchApps = async (projectId) => {
    const res = await newRequest.get(`/apps/project/${projectId}`);
    setApps(res.data);
  };

  const fetchUsers = async () => {
    const res = await newRequest.get("/users");
    setUsers(res.data);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchProjects();
    fetchUsers();
  }, [user]);

  // console.log(projects)
  // console.log(user)

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchApps(project._id);
  };

  // CRUD Projects
  const addProject = async () => {
    if (!projectName) return;
    const res = await newRequest.post("/projects", { name: projectName });
    setProjects([...projects, res.data]);
    setProjectName("");
  };

  const saveProject = async (id) => {
    const res = await newRequest.patch(`/projects/${id}`, { name: editName });
    setProjects(projects.map((p) => (p._id === id ? res.data : p)));
    setEditingProject(null);
    setEditName("");
  };

  const cancelEditProject = () => {
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

  // CRUD Apps
  const addApp = async () => {
    if (!selectedProject || !appName) return;
    const res = await newRequest.post("/apps", {
      projectId: selectedProject._id,
      name: appName,
      type: appType,
    });
    setApps([...apps, res.data]);
    setAppName("");
  };

  const saveApp = async (id) => {
    const res = await newRequest.patch(`/apps/${id}`, { name: editAppName });
    setApps(apps.map((a) => (a._id === id ? res.data : a)));
    setEditingApp(null);
    setEditAppName("");
  };

  const cancelEditApp = () => {
    setEditingApp(null);
    setEditAppName("");
  };

  const deleteApp = async (id) => {
    await newRequest.delete(`/apps/${id}`);
    setApps(apps.filter((a) => a._id !== id));
  };

  // Share project
  const shareProject = async () => {
    if (!selectedProject || shareUsers.length === 0) return;
    await newRequest.post("/projects/share", {
      projectId: selectedProject._id,
      userIds: shareUsers.map((u) => u.value),
    });
    alert("Project shared!");
    setShareUsers([]);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  return (
    <div className="project-manager">
      {/* Sidebar */}

      <div className="sidebar" style={{maxWidth:'300px'}} >
        <h3>Projects</h3>
        <div className="add-row">
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="New project"
          />
          <button onClick={addProject}>Add</button>
        </div>

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

        {/* Projects */}
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
              {projects.map((p) =>
                editingProject === p._id ? (
                  <tr key={p._id}>
                    <td>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </td>
                    <td>{p.owner?.email || "You"}</td>
                    <td>{p.sharedWith?.length || 0}</td>
                    <td>
                      <button onClick={() => saveProject(p._id)}>Save</button>
                      <button onClick={cancelEditProject}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={p._id} onClick={() => handleProjectSelect(p)}>
                    <td>{p.name}</td>
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
                )
              )}
            </tbody>
          </table>
        ) : (
          <div className={`projects ${viewMode}`}>
            {projects.map((p) =>
              editingProject === p._id ? (
                <div key={p._id} className="edit-row">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <button onClick={() => saveProject(p._id)}>Save</button>
                  <button onClick={cancelEditProject}>Cancel</button>
                </div>
              ) : (
                <div
                  key={p._id}
                  className="project-card"
                  onClick={() => handleProjectSelect(p)}
                >
                  <h4>{p.name}</h4>
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
              )
            )}
          </div>
        )}

        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </div>

      {/* Content */}
      <div className="content" >
        {selectedProject && (
          <>
            <h3>Apps in {selectedProject.name}</h3>
            <div className="add-row">
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="App Name"
              />
              <select
                value={appType}
                onChange={(e) => setAppType(e.target.value)}
              >
                <option value="notes">Notes</option>
                <option value="todos">Todos</option>
                <option value="task_manager">Task Manager</option>
                <option value="trello">Trello</option>
                <option value="canva">Canva</option>
              </select>
              <button onClick={addApp}>Add App</button>
            </div>

            <ul className="apps-list">
              {apps.map((app) =>
                editingApp === app._id ? (
                  <li key={app._id} className="edit-row">
                    <input
                      value={editAppName}
                      onChange={(e) => setEditAppName(e.target.value)}
                    />
                    <button onClick={() => saveApp(app._id)}>Save</button>
                    <button onClick={cancelEditApp}>Cancel</button>
                  </li>
                ) : (
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
                )
              )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;






// ✅ ProjectsAlt.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import newRequest from "../../api/newRequest";
import "./ProjectsAlt.css";

const ProjectsAlt = () => {
  const [designs, setDesigns] = useState([]);
  const [loader, setLoader] = useState(false);

  const getUserDesigns = async () => {
    try {
      setLoader(true);
      const { data } = await newRequest.get("/user-designs");
      setDesigns(data.designs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const delete_design = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await newRequest.delete(`/delete-user-image/${id}`);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete design.");
      console.error(err);
    }
  };

  useEffect(() => {
    getUserDesigns();
  }, []);

  return (
    <div className="projects-container">
      <div className="projects-grid">
        {loader ? (
          <p className="status-text">Loading...</p>
        ) : designs.length === 0 ? (
          <p className="status-text">No projects found.</p>
        ) : (
          designs.map((d) => (
            <div key={d._id} className="project-card">
              <Link to={`/design/${d._id}/edit`} className="project-link">
                <img src={d.image_url} alt="User Design" className="project-image" />
              </Link>
              <button className="delete-btn" onClick={() => delete_design(d._id)}>
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsAlt;
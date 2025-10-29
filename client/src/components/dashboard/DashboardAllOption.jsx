// src/comonents/dashboard/DashboardAllOption.jsx
import React, { useState } from "react";
// import DashboardEditOption from "./DashboardEditOption"; // optional modal, can be stubbed
import { Edit, Trash2, Table as TableIcon, Grid } from "lucide-react";
import "./DashboardAllOption.css";

// Dummy Data
const dummyOptions = [
  { id: "1", title: "Option One", description: "This is a description for option one." },
  { id: "2", title: "Option Two", description: "This is a longer description for option two, explaining something important to see how truncation works." },
  { id: "3", title: "Option Three", description: "Short description." },
  { id: "4", title: "Option Four", description: "Another description that is fairly long and needs truncation in the card view." },
  { id: "5", title: "Option Five", description: "Simple description text." },
];

const DashboardAllOption = () => {
  const [options, setOptions] = useState(dummyOptions);
  const [editOptions, setEditOptions] = useState(null);
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"

  const handleDelete = (id) => {
    const filtered = options.filter((opt) => opt.id !== id);
    setOptions(filtered);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">All Options</h1>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            <Grid size={16} /> Card View
          </button>
          <button
            className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <TableIcon size={16} /> Table View
          </button>
        </div>
      </div>

      {/* Card Grid View */}
      {viewMode === "card" && (
        <div className="options-grid">
          {options.map((option) => (
            <div className="option-card" key={option.id}>
              <div className="option-card-body">
                <h3 className="option-title">{option.title}</h3>
                <p className="option-description">
                  {option.description.length > 50
                    ? option.description.substring(
                        0,
                        option.description.lastIndexOf(" ", 50)
                      ) + "..."
                    : option.description}
                </p>
              </div>
              <div className="option-card-actions">
                <button
                  className="btn edit-btn"
                  onClick={() => setEditOptions(option)}
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDelete(option.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="options-table-container">
          <table className="options-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, index) => (
                <tr key={option.id}>
                  <td>{index + 1}</td>
                  <td>{option.title}</td>
                  <td>
                    {option.description.length > 50
                      ? option.description.substring(
                          0,
                          option.description.lastIndexOf(" ", 50)
                        ) + "..."
                      : option.description}
                  </td>
                  <td>
                    <button
                      className="btn edit-btn table-btn"
                      onClick={() => setEditOptions(option)}
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      className="btn delete-btn table-btn"
                      onClick={() => handleDelete(option.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Optional edit modal */}
      {editOptions && (
        <DashboardEditOption
          option={editOptions}
          onClose={() => setEditOptions(null)}
        />
      )}
    </div>
  );
};

export default DashboardAllOption;










/*
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import DashboardEditOption from "./DashboardEditOption";
import { Edit, Trash2 } from "lucide-react";
import "./DashboardAllOption.css";

const DashboardAllOption = () => {
  const [options, setOptions] = useState([]);
  const [editOptions, setEditOptions] = useState(null);

  const fetchOptions = async () => {
    const snapshot = await getDocs(collection(db, "options"));
    setOptions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "options", id));
    fetchOptions();
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">All Options</h1>


      <div className="options-grid">
        {options.map((option) => (
          <div className="option-card" key={option.id}>
            <div className="option-card-body">
              <h3 className="option-title">{option.title}</h3>
              <p className="option-description">
                {option.description.length > 20
                  ? option.description.substring(
                      0,
                      option.description.lastIndexOf(" ", 20)
                    ) + "..."
                  : option.description}
              </p>
            </div>
            <div className="option-card-actions">
              <button
                className="btn edit-btn"
                onClick={() => setEditOptions(option)}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                className="btn delete-btn"
                onClick={() => handleDelete(option.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="options-table-container">
        <table className="options-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option, index) => (
              <tr key={option.id}>
                <td>{index + 1}</td>
                <td>{option.title}</td>
                <td>
                  {option.description.length > 20
                    ? option.description.substring(
                        0,
                        option.description.lastIndexOf(" ", 20)
                      ) + "..."
                    : option.description}
                </td>
                <td>
                  <button
                    className="btn edit-btn table-btn"
                    onClick={() => setEditOptions(option)}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    className="btn delete-btn table-btn"
                    onClick={() => handleDelete(option.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editOptions && (
        <DashboardEditOption
          option={editOptions}
          onClose={() => {
            setEditOptions(null);
            fetchOptions();
          }}
        />
      )}
    </div>
  );
};

export default DashboardAllOption;
*/


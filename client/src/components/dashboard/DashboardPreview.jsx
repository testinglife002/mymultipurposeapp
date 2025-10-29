// src/comonents/dashboard/DashboardPreview.jsx
import React, { useState } from "react";
import { Trash2, Edit, Menu, Grid, List } from "lucide-react";
import "./DashboardPreview.css";

const dummySegments = [
  {
    id: 1,
    title: "Segment 1",
    bangla: "সেগমেন্ট ১",
    description: "This is a description for segment 1",
  },
  {
    id: 2,
    title: "Segment 2",
    bangla: "সেগমেন্ট ২",
    description: "This is a description for segment 2, longer text example.",
  },
  {
    id: 3,
    title: "Segment 3",
    bangla: "সেগমেন্ট ৩",
    description: "Segment 3 description",
  },
  {
    id: 4,
    title: "Segment 4",
    bangla: "সেগমেন্ট ৪",
    description: "Segment 4 description with more text to test overflow",
  },
];

const DashboardPreview = () => {
  const [view, setView] = useState("cards"); // cards or table
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>My Dashboard</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active">Home</button>
          <button className="nav-item">Segments</button>
          <button className="nav-item">Analytics</button>
          <button className="nav-item">Settings</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1>All Segments</h1>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${view === "cards" ? "active" : ""}`}
              onClick={() => setView("cards")}
            >
              <Grid size={18} /> Cards
            </button>
            <button
              className={`toggle-btn ${view === "table" ? "active" : ""}`}
              onClick={() => setView("table")}
            >
              <List size={18} /> Table
            </button>
          </div>
        </header>

        {/* Cards View */}
        {view === "cards" && (
          <section className="segment-cards-grid">
            {dummySegments.map((seg) => (
              <div className="segment-card" key={seg.id}>
                <div className="segment-card-body">
                  <h4 className="segment-title">{seg.title}</h4>
                  <div className="segment-bangla">{seg.bangla}</div>
                  <p className="segment-desc">
                    {seg.description.length > 40
                      ? seg.description.substring(0, 40) + "..."
                      : seg.description}
                  </p>
                </div>
                <div className="segment-card-actions">
                  <button className="btn-edit">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="btn-delete">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Table View */}
        {view === "table" && (
          <section className="segment-table-section">
            <table className="segment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Bangla</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dummySegments.map((seg, idx) => (
                  <tr key={seg.id}>
                    <td>{idx + 1}</td>
                    <td>{seg.title}</td>
                    <td>{seg.bangla}</td>
                    <td>{seg.description}</td>
                    <td>
                      <button className="btn-edit">
                        <Edit size={16} /> Edit
                      </button>
                      <button className="btn-delete">
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPreview;
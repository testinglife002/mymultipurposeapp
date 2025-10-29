// src/comonents/dashboard/DashboardAllSegment.jsx
// 1️⃣ DashboardAllSegment.jsx
import React, { useEffect, useState } from "react";
import { Trash2, Edit } from "lucide-react";
// import DashboardEditSegment from "./DashboardEditSegment";

import "./DashboardAllSegment.css";

const DashboardAllSegment = () => {
  const [segments, setSegments] = useState([]);
  const [editSegment, setEditSegment] = useState(null);

  

  return (
    <div className="dashboard-segment-container">
      <h1>All Segments</h1>

      <section className="segment-cards-section">
        <h3>Segments Overview</h3>
        <div className="segment-cards-grid">
    
            <div className="segment-card">
              <div className="segment-card-body">
                <h4 className="segment-title">title</h4>
                <div
                  className="segment-bangla"
                  dangerouslySetInnerHTML={{ __html: bangla }}
                ></div>
                <p className="segment-desc">
           
                description
                      
                </p>
              </div>
              <div className="segment-card-actions">
                <button
                  className="btn-edit"
             
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(segment.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
   
        </div>
      </section>

      <section className="segment-table-section">
        <h3>Segments Table</h3>
        <table className="segment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Title (Bangla)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          
              <tr >
                <td>1</td>
                <td>title</td>
                <td>bangla</td>
                <td>
                  <button
                    className="btn-edit"
                 
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    className="btn-delete"
                    
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
   
          </tbody>
        </table>
      </section>

      {editSegment && (
        <DashboardEditSegment
          segment={editSegment}
          onClose={() => {
            setEditSegment(null);
       
          }}
        />
      )}
    </div>
  );
};

export default DashboardAllSegment;
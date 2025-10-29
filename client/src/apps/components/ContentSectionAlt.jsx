// components/appmaterial/ContentSectionAlt.jsx
import React from 'react';
import './ContentSectionAlt.css';
import { FaTh, FaList, FaColumns, FaTable } from 'react-icons/fa';

const sampleData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Brief description for item ${i + 1}`,
  status: ['Todo', 'In Progress', 'Done'][i % 3],
}));

export default function ContentSectionAlt({ viewMode, setViewMode }) {
  return (
    <div className="app-mat-content-section">
      <div className="app-mat-content-header">
        <h2 className="app-mat-content-title">Content</h2>
        <div className="app-mat-view-toggle">
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <FaTh />
          </button>
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <FaList />
          </button>
          <button
            className={viewMode === 'board' ? 'active' : ''}
            onClick={() => setViewMode('board')}
            title="Board View"
          >
            <FaColumns />
          </button>
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <FaTable />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="app-mat-grid">
          {sampleData.map(item => (
            <div key={item.id} className="app-mat-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="app-mat-list">
          {sampleData.map(item => (
            <div key={item.id} className="app-mat-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="app-mat-board">
          {['Todo', 'In Progress', 'Done'].map(status => (
            <div key={status} className="app-mat-board-column">
              <h4>{status}</h4>
              {sampleData
                .filter(i => i.status === status)
                .map(i => (
                  <div key={i.id} className="app-mat-card">{i.title}</div>
                ))}
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <table className="app-mat-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>{row.description}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

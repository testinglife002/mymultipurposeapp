// src/comonents/dashboard/DashboardAllCategoryType.jsx
import React, { useState } from 'react';
import { Trash2, Edit2, Grid, List } from 'lucide-react';
import './DashboardAllCategoryType.css';
// import DashboardEditCategoryType from './DashboardEditCategoryType'; // keep it for edit modal

// Dummy data for preview
const dummyCategoryTypes = [
  { id: '1', title: 'Web Design', description: 'All about creating stunning web designs and UI/UX.' },
  { id: '2', title: 'Mobile Apps', description: 'Development and design of mobile applications for iOS and Android.' },
  { id: '3', title: 'Marketing', description: 'Strategies, campaigns, and marketing tools for businesses.' },
  { id: '4', title: 'Photography', description: 'Tips and tutorials for professional photography and editing.' },
  { id: '5', title: 'Writing', description: 'Content creation, copywriting, and blogging guides.' },
];

const DashboardAllCategoryType = () => {
  const [categoryTypes, setCategoryTypes] = useState(dummyCategoryTypes);
  const [editCategoryTypes, setEditCategoryTypes] = useState(null);
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' or 'table'

  const handleDelete = (id) => {
    setCategoryTypes(prev => prev.filter(cat => cat.id !== id));
  };

  const truncateText = (text, limit = 50) => {
    if (text.length <= limit) return text;
    return text.substring(0, text.lastIndexOf(' ', limit)) + '...';
  };

  return (
    <div className="dashboard-category-container">
      <h1 className="dashboard-title">All Category Types</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          <Grid size={16} /> Grid View
        </button>
        <button
          className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => setActiveTab('table')}
        >
          <List size={16} /> Table View
        </button>
      </div>

      {/* Grid View */}
      {activeTab === 'grid' && (
        <section className="cards-section">
          <div className="cards-grid">
            {categoryTypes.map(catType => (
              <div className="category-card" key={catType.id}>
                <div className="card-content">
                  <h3>{catType.title}</h3>
                  <p>{truncateText(catType.description, 60)}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => setEditCategoryTypes(catType)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(catType.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Table View */}
      {activeTab === 'table' && (
        <section className="table-section">
          <table className="category-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryTypes.map((catType, index) => (
                <tr key={catType.id}>
                  <td>{index + 1}</td>
                  <td>{catType.title}</td>
                  <td>{truncateText(catType.description, 80)}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => setEditCategoryTypes(catType)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(catType.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {editCategoryTypes && (
        <DashboardEditCategoryType
          categoryType={editCategoryTypes}
          onClose={() => setEditCategoryTypes(null)}
        />
      )}
    </div>
  );
};

export default DashboardAllCategoryType;


/*
import React, { useEffect, useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import DashboardEditCategoryType from './DashboardEditCategoryType';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './DashboardAllCategoryType.css'; // custom CSS

const DashboardAllCategoryType = () => {
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [editCategoryTypes, setEditCategoryTypes] = useState(null);

  const fetchCategoryTypes = async () => {
    const snapshot = await getDocs(collection(db, 'category-types'));
    setCategoryTypes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCategoryTypes();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'category-types', id));
    fetchCategoryTypes();
  };

  const truncateText = (text, limit = 50) => {
    if (text.length <= limit) return text;
    return text.substring(0, text.lastIndexOf(' ', limit)) + '...';
  };

  return (
    <div className="dashboard-category-container">
      <h1 className="dashboard-title">All Category Types</h1>

     
      <section className="cards-section">
        <h2>Category Types Overview</h2>
        <div className="cards-grid">
          {categoryTypes.map(catType => (
            <div className="category-card" key={catType.id}>
              <div className="card-content">
                <h3>{catType.title}</h3>
                <p>{truncateText(catType.description, 60)}</p>
              </div>
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => setEditCategoryTypes(catType)}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(catType.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="table-section">
        <h2>Category Types Table</h2>
        <table className="category-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryTypes.map((catType, index) => (
              <tr key={catType.id}>
                <td>{index + 1}</td>
                <td>{catType.title}</td>
                <td>{truncateText(catType.description, 80)}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setEditCategoryTypes(catType)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(catType.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editCategoryTypes && (
        <DashboardEditCategoryType
          categoryType={editCategoryTypes}
          onClose={() => {
            setEditCategoryTypes(null);
            fetchCategoryTypes();
          }}
        />
      )}
    </div>
  );
};

export default DashboardAllCategoryType;
*/


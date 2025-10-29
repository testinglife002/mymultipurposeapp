// frontend/src/pages/admin/SingleSubcategoryManager.jsx
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';

import './SingleSubcategoryManager.css';

const SingleSubcategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [subName, setSubName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expanded, setExpanded] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ id: '', name: '' });

  
  const selectedSubcategories = allCategories.filter(c => c.parentId === selectedCat);

  const renderSubcategories = (parentId) => {
    const subs = allCategories.filter(c => c.parentId === parentId);
    if (!subs.length) return null;

    return (
      <div className={`subcategories ${expanded[parentId] ? 'expanded' : ''}`}>
      
          <div className="subcategory-item" key={sub.id}>
            <span>subname</span>
            <div className="actions">
              <button onClick={() => { setCurrentEdit({ id: sub.id, name: sub.name }); setShowEditModal(true); }}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDeleteSub(sub.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
       
      </div>
    );
  };

  return (
    <div className="manager-container">
      <section className="subcategory-manager">
        <h2>Manage Subcategories</h2>

        <div className="category-links">
          <a href="/dashboard/category-manager" className="btn btn-info">Category</a>
          <a href="/dashboard/category-manager-alt" className="btn btn-warning">Category Alt</a>
          <a href="/dashboard/category-manager-ui" className="btn btn-secondary">Category UI</a>
          <a href="/dashboard/single-category-manager" className="btn btn-danger">Single Category</a>
          <a href="/dashboard/single-subcategory-manager" className="btn btn-dark">Single Subcategory</a>
        </div>

        <div className="select-category">
          <label>Select Category</label>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            <option value="">-- Select Category --</option>
          
              <option >name</option>
          
          </select>
        </div>

   
          <div className="subcategory-section">
            <div className="add-subcategory">
              <input
                type="text"
                placeholder="Enter subcategory name"

          
              />
              <button >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="subcategories-list">
             
         
                <div className="subcategory-item" key={sc.id}>
                  <span>name</span>
                  <div className="actions">
                    <button onClick={() => { setCurrentEdit({ id: sc.id, name: sc.name }); setShowEditModal(true); }}>
                      <Edit2 size={16} />
                    </button>
                    <button >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
         
            </div>
          </div>
      
      </section>

      <section className="category-manager">
        <h2>Category Manager</h2>
        <div className="add-category">
          <input
            type="text"
            placeholder="Add new category"
 
          
          />
          <button><Plus size={16} /> Add</button>
        </div>

        <div className="category-list">
       
            <div className="category-item">
              <div className="category-header">
                <span>
                  {expanded[cat.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
                <div className="actions">
                  <button onClick={() => { setCurrentEdit({ id: cat.id, name: cat.name }); setShowEditModal(true); }}><Edit2 size={16} /></button>
                  <button ><Trash2 size={16} /></button>
                </div>
              </div>
              {renderSubcategories(cat.id)}
            </div>
    
        </div>
      </section>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Category</h3>
            <input
              type="text"
              value={currentEdit.name}
              onChange={e => setCurrentEdit(prev => ({ ...prev, name: e.target.value }))}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSubcategoryManager;

// src/admin/pages/SingleSubcategoryManager.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';
import './SingleSubcategoryManager.css';

const dummyCategories = [
  { id: '1', name: 'Technology', parentId: null },
  { id: '2', name: 'Programming', parentId: '1' },
  { id: '3', name: 'Design', parentId: '1' },
  { id: '4', name: 'Lifestyle', parentId: null },
  { id: '5', name: 'Travel', parentId: '4' },
];

const SingleSubcategoryManager = () => {
  const [categories, setCategories] = useState(dummyCategories);
  const [selectedCat, setSelectedCat] = useState('');
  const [subName, setSubName] = useState('');
  const [expanded, setExpanded] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ id: '', name: '' });

  const handleAddSubcategory = () => {
    if (!subName || !selectedCat) return;
    const newSub = { id: Date.now().toString(), name: subName, parentId: selectedCat };
    setCategories(prev => [...prev, newSub]);
    setSubName('');
  };

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedSubcategories = categories.filter(c => c.parentId === selectedCat);

  const renderSubcategories = (parentId) => {
    const subs = categories.filter(c => c.parentId === parentId);
    if (!subs.length) return null;

    return (
      <div className={`subcategories ${expanded[parentId] ? 'expanded' : ''}`}>
        {subs.map(sub => (
          <div className="subcategory-item" key={sub.id}>
            <span>{sub.name}</span>
            <div className="actions">
              <button onClick={() => { setCurrentEdit(sub); setShowEditModal(true); }}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(sub.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="manager-container">
      <section className="subcategory-manager">
        <h2>Manage Subcategories (Dummy Data)</h2>

        <div className="select-category">
          <label>Select Category</label>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            <option value="">-- Select Category --</option>
            {categories.filter(c => !c.parentId).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {selectedCat && (
          <div className="subcategory-section">
            <div className="add-subcategory">
              <input
                type="text"
                placeholder="Enter subcategory name"
                value={subName}
                onChange={e => setSubName(e.target.value)}
              />
              <button onClick={handleAddSubcategory}><Plus size={16} /> Add</button>
            </div>

            <div className="subcategories-list">
              {selectedSubcategories.length === 0 && <p>No subcategories found.</p>}
              {selectedSubcategories.map(sc => (
                <div className="subcategory-item" key={sc.id}>
                  <span>{sc.name}</span>
                  <div className="actions">
                    <button onClick={() => { setCurrentEdit(sc); setShowEditModal(true); }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(sc.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="category-list">
          {categories.filter(c => !c.parentId).map(cat => (
            <div className="category-item" key={cat.id}>
              <div className="category-header" onClick={() => toggleExpand(cat.id)}>
                {expanded[cat.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />} {cat.name}
              </div>
              {renderSubcategories(cat.id)}
            </div>
          ))}
        </div>
      </section>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Category</h3>
            <input type="text" value={currentEdit.name} onChange={e => setCurrentEdit(prev => ({ ...prev, name: e.target.value }))} />
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={() => { setCategories(prev => prev.map(c => c.id === currentEdit.id ? currentEdit : c)); setShowEditModal(false); }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSubcategoryManager;






/*
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';
import { addCategory, deleteCategory, getCategories, updateCategory } from '../../services/CategoryService';
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

  const fetchCategories = async () => {
    const all = await getCategories();
    setCategories(all.filter(c => !c.parentId));
    setAllCategories(all);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory({ name: newCategoryName });
    setNewCategoryName('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  const handleAddSubcategory = async () => {
    if (subName && selectedCat) {
      await addCategory(subName, selectedCat);
      setSubName('');
      fetchCategories();
    }
  };

  const handleDeleteSub = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  const handleEdit = async () => {
    if (!currentEdit.name.trim()) return;
    await updateCategory(currentEdit.id, { name: currentEdit.name });
    setShowEditModal(false);
    fetchCategories();
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedSubcategories = allCategories.filter(c => c.parentId === selectedCat);

  const renderSubcategories = (parentId) => {
    const subs = allCategories.filter(c => c.parentId === parentId);
    if (!subs.length) return null;

    return (
      <div className={`subcategories ${expanded[parentId] ? 'expanded' : ''}`}>
        {subs.map(sub => (
          <div className="subcategory-item" key={sub.id}>
            <span>{sub.name}</span>
            <div className="actions">
              <button onClick={() => { setCurrentEdit({ id: sub.id, name: sub.name }); setShowEditModal(true); }}>
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDeleteSub(sub.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
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
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {selectedCat && (
          <div className="subcategory-section">
            <div className="add-subcategory">
              <input
                type="text"
                placeholder="Enter subcategory name"
                value={subName}
                onChange={e => setSubName(e.target.value)}
              />
              <button onClick={handleAddSubcategory}>
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="subcategories-list">
              {selectedSubcategories.length === 0 && <p>No subcategories found.</p>}
              {selectedSubcategories.map(sc => (
                <div className="subcategory-item" key={sc.id}>
                  <span>{sc.name}</span>
                  <div className="actions">
                    <button onClick={() => { setCurrentEdit({ id: sc.id, name: sc.name }); setShowEditModal(true); }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteSub(sc.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="category-manager">
        <h2>Category Manager</h2>
        <div className="add-category">
          <input
            type="text"
            placeholder="Add new category"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory}><Plus size={16} /> Add</button>
        </div>

        <div className="category-list">
          {allCategories.filter(c => !c.parentId).map(cat => (
            <div className="category-item" key={cat.id}>
              <div className="category-header">
                <span onClick={() => toggleExpand(cat.id)}>
                  {expanded[cat.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />} {cat.name}
                </span>
                <div className="actions">
                  <button onClick={() => { setCurrentEdit({ id: cat.id, name: cat.name }); setShowEditModal(true); }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              {renderSubcategories(cat.id)}
            </div>
          ))}
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
*/


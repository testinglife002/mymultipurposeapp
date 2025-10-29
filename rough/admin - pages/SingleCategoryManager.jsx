// src/admin/pages/SingleCategoryManager.jsx
// SingleCategoryManager.jsx (with dummy data and drag & drop)
import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronRight, Move } from 'lucide-react'
import './SingleCategoryManager.css'

const DUMMY_CATEGORIES = [
  { id: '1', name: 'Electronics', parentId: null },
  { id: '2', name: 'Laptops', parentId: '1' },
  { id: '3', name: 'Phones', parentId: '1' },
  { id: '4', name: 'Fashion', parentId: null },
  { id: '5', name: 'Men', parentId: '4' },
  { id: '6', name: 'Women', parentId: '4' },
]

export default function SingleCategoryManager() {
  const [categories, setCategories] = useState(DUMMY_CATEGORIES)
  const [expanded, setExpanded] = useState({})
  const [editData, setEditData] = useState({ id: '', name: '' })
  const [showModal, setShowModal] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)

  const handleEdit = (cat) => {
    setEditData(cat)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id && cat.parentId !== id))
  }

  const handleUpdate = () => {
    setCategories(prev =>
      prev.map(cat => (cat.id === editData.id ? { ...cat, name: editData.name } : cat))
    )
    setShowModal(false)
  }

  // Drag & Drop
  const onDragStart = (e, cat) => {
    setDraggedItem(cat)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e, cat) => {
    e.preventDefault()
    if (draggedItem && draggedItem.id !== cat.id) {
      setCategories(prev => {
        const copy = [...prev]
        const draggedIndex = copy.findIndex(c => c.id === draggedItem.id)
        const targetIndex = copy.findIndex(c => c.id === cat.id)

        copy.splice(draggedIndex, 1)
        copy.splice(targetIndex, 0, draggedItem)
        return copy
      })
    }
    setDraggedItem(null)
  }

  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => (
        <div
          className="category-item"
          key={cat.id}
          draggable
          onDragStart={(e) => onDragStart(e, cat)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, cat)}
        >
          <div className="category-header">
            <div className="category-left">
              {categories.some(c => c.parentId === cat.id) && (
                <span
                  className="expand-toggle"
                  onClick={() => setExpanded(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                >
                  {expanded[cat.id] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                </span>
              )}
              <span className="category-name">{cat.name}</span>
            </div>
            <div className="category-actions">
              <Move size={16} className="drag-icon"/>
              <button className="btn-icon edit" onClick={() => handleEdit(cat)}>
                <Pencil size={16}/>
              </button>
              <button className="btn-icon delete" onClick={() => handleDelete(cat.id)}>
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
          {expanded[cat.id] && (
            <div className="category-children">
              {buildTree(cat.id)}
            </div>
          )}
        </div>
      ))
  }

  return (
    <div className="single-category-manager">
      <div className="card">
        <h4 className="card-title">Single Category Manager</h4>
        <div className="category-list">{buildTree()}</div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h5>Edit Category</h5>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




/*
import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { addCategory, deleteCategory, getCategories, updateCategory } from '../../services/CategoryService'
import { Link } from 'react-router-dom'
import './SingleCategoryManager.css'

const SingleCategoryManager = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState({ id: '', name: '' })

  const fetch = async () => {
    const all = await getCategories()
    setCategories(all)
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    await addCategory(name, parentId)
    setName('')
    setParentId(null)
    fetch()
  }

  const handleDelete = async (id) => {
    await deleteCategory(id)
    fetch()
  }

  const handleUpdate = async () => {
    if (!editData.name.trim()) return
    await updateCategory(editData.id, editData.name)
    setShowModal(false)
    fetch()
  }

  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => (
        <div className="category-item" key={cat.id}>
          <div className="category-header">
            <div className="category-left">
              {categories.some(c => c.parentId === cat.id) && (
                <span
                  className="expand-toggle"
                  onClick={() => setExpanded(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                >
                  {expanded[cat.id] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                </span>
              )}
              <span className="category-name">{cat.name}</span>
            </div>
            <div className="category-actions">
              <button className="btn-icon edit" onClick={() => { setEditData({ id: cat.id, name: cat.name }); setShowModal(true) }}>
                <Pencil size={16} />
              </button>
              <button className="btn-icon delete" onClick={() => handleDelete(cat.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {expanded[cat.id] && (
            <div className="category-children">
              {buildTree(cat.id)}
            </div>
          )}
        </div>
      ))
  }

  return (
    <div className="single-category-manager">
      <div className="card">
        <h4 className="card-title">Manage Main Categories</h4>
      </div>

      <div className="nav-links">
        <Link to="/dashboard/category-manager" className="btn-link info">Category</Link>
        <Link to="/dashboard/category-manager-alt" className="btn-link warning">Category Alt</Link>
        <Link to="/dashboard/category-manager-ui" className="btn-link secondary">Category UI</Link>
        <Link to="/dashboard/single-category-manager" className="btn-link danger">Single Category</Link>
        <Link to="/dashboard/single-subcategory-manager" className="btn-link dark">Single Subcategory</Link>
      </div>

      <div className="card">
        <h4 className="card-title">Single Category Manager</h4>

        <form className="category-form" onSubmit={e => { e.preventDefault(); handleAdd() }}>
          <input
            type="text"
            value={name}
            placeholder="Enter category name"
            onChange={e => setName(e.target.value)}
          />
          <select value={parentId || ''} onChange={e => setParentId(e.target.value || null)}>
            <option value="">Top Level</option>
            {categories.filter(c => !c.parentId).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-submit">Add</button>
        </form>

        <div className="category-list">
          {buildTree()}
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h5>Edit Category</h5>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default SingleCategoryManager
*/


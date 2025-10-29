// src/admin/components/AddCategoryUI.jsx (React Component)
// src/components/category/AddCategoryUI.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import newRequest from '../../api/newRequest';
import './AddCategoryUI.css';

const AddCategoryUI = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await newRequest.post('/categories', {
        name,
        parentId: parentId || null,
      });
      alert('Category added!');
      setName('');
      setParentId('');
      if (onCategoryAdded) onCategoryAdded(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-card">
      <h3 className="add-category-title">
        <Plus size={20} className="icon" /> Add New Category
      </h3>
      <form onSubmit={handleSubmit} className="add-category-form">
        <input
          type="text"
          value={name}
          placeholder="Category Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          value={parentId}
          placeholder="Parent Category ID (optional)"
          onChange={(e) => setParentId(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryUI;
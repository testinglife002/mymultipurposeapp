// components/appmaterial/SettingsPanel.jsx
import React from 'react';
import './SettingsPanel.css';
import { FaTimes } from 'react-icons/fa';

export default function SettingsPanel({ open, onClose }) {
  return (
    <div className={`app-mat-settings-panel ${open ? 'open' : ''}`}>
      <div className="app-mat-settings-header">
        <h3>Settings</h3>
        <button className="app-mat-settings-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="app-mat-settings-content">
        <h4>Preferences</h4>
        <div className="app-mat-settings-item">
          <label>
            <input type="checkbox" defaultChecked /> Enable Notifications
          </label>
        </div>
        <div className="app-mat-settings-item">
          <label>
            <input type="checkbox" /> Compact Layout
          </label>
        </div>
        <div className="app-mat-settings-item">
          <label>
            <input type="checkbox" /> Auto Dark Mode
          </label>
        </div>
      </div>
    </div>
  );
}

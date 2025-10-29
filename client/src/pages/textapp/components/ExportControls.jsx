// src/components/ExportControls.jsx
// src/components/ExportControls.jsx
import React from 'react';
import './variables.css';
import './ExportControls.css';

export default function ExportControls({ canvasId, template }) {
  return (
    <div className="export-controls">
      <div>Canvas: {canvasId}</div>
      <div>{template ? template.name : 'No template selected'}</div>
    </div>
  );
}





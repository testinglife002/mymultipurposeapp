// ✅ TemplateDesignAlt.jsx
import React from "react";
import "./TemplateDesignAlt.css";

const TemplateDesignAlt = () => {
  return (
    <div className="template-grid">
      {[1, 2, 3, 4].map((_, i) => (
        <div key={i} className="template-item">
          <img src="http://localhost:5173/project.jpg" alt="Template" />
        </div>
      ))}
    </div>
  );
};

export default TemplateDesignAlt;
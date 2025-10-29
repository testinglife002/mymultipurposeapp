import React, { useState } from "react";
import TextTemplateList from "./TextTemplateList";
import BannerMakerNew from "./BannerMakerNew";

export default function TextTemplateManager() {
  const [editingTemplate, setEditingTemplate] = useState(null);

  return (
    <div className="d-flex gap-4">
      <div style={{ width: 300 }}>
        <TextTemplateList onSelect={(tpl) => setEditingTemplate(tpl)} />
      </div>

      <div style={{ flex: 1 }}>
        {editingTemplate ? (
          <BannerMakerNew template={editingTemplate} />
        ) : (
          <p>Select a template to edit</p>
        )}
      </div>
    </div>
  );
}

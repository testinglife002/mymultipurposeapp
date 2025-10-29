// TemplateManagerPage.jsx
import React, { useState } from "react";
import EditTemplatePage from "./EditTemplatePage";
import TextTemplateList from "./TextTemplateList";

export default function TemplateManagerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="container-fluid mt-3">
      {!selectedTemplate ? (
        <TextTemplateList onSelect={(t) => setSelectedTemplate(t)} />
      ) : (
        <EditTemplatePage templateId={selectedTemplate._id} />
      )}
    </div>
  );
}

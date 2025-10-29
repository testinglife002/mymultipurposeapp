// ElementControls.jsx
import React from "react";

export default function ElementControls({ selected, bg, setBg, main, setMain, layers, setLayers, texts, setTexts }) {
  const updateSelected = (key, value) => {
    if (selected.type === "background") setBg((p) => ({ ...p, [key]: value }));
    else if (selected.type === "main") setMain((p) => ({ ...p, [key]: value }));
    else if (selected.type === "layer")
      setLayers((prev) => prev.map((l) => (l.id === selected.id ? { ...l, [key]: value } : l)));
    else if (selected.type === "text")
      setTexts((prev) => prev.map((t) => (t.id === selected.id ? { ...t, [key]: value } : t)));
  };

  const active =
    selected.type === "background"
      ? bg
      : selected.type === "main"
      ? main
      : selected.type === "layer"
      ? layers.find((l) => l.id === selected.id)
      : selected.type === "text"
      ? texts.find((t) => t.id === selected.id)
      : null;

  if (!active) return <p className="text-muted p-2">No element selected</p>;

  return (
    <div className="element-controls">
      <h6>Controls ({selected.type})</h6>

      <label>Scale</label>
      <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={active.scale || 1}
        onChange={(e) => updateSelected("scale", parseFloat(e.target.value))}
      />

      <label>Rotation</label>
      <input
        type="range"
        min="0"
        max="360"
        value={active.rotation || 0}
        onChange={(e) => updateSelected("rotation", parseFloat(e.target.value))}
      />

      <label>Blur</label>
      <input
        type="range"
        min="0"
        max="20"
        step="0.5"
        value={active.blur || 0}
        onChange={(e) => updateSelected("blur", parseFloat(e.target.value))}
      />

      <label>Opacity</label>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        value={active.opacity || 1}
        onChange={(e) => updateSelected("opacity", parseFloat(e.target.value))}
      />

      {selected.type === "text" && (
        <>
          <label>Font Size</label>
          <input
            type="number"
            value={active.size || 32}
            onChange={(e) => updateSelected("size", parseInt(e.target.value))}
          />

          <label>Font Family</label>
          <input type="text" value={active.font || "Arial"} onChange={(e) => updateSelected("font", e.target.value)} />

          <label>Text Color</label>
          <input type="color" value={active.color || "#fff"} onChange={(e) => updateSelected("color", e.target.value)} />

          <label>Background Color</label>
          <input type="color" value={active.bgColor || "#00000033"} onChange={(e) => updateSelected("bgColor", e.target.value)} />
        </>
      )}

      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateSelected("flipH", !active.flipH)}>
          Flip H
        </button>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateSelected("flipV", !active.flipV)}>
          Flip V
        </button>
      </div>
    </div>
  );
}


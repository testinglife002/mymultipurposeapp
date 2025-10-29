// BlendModeSelector.jsx (with live preview)
import React from "react";
import './BlendModeSelector.css';

const blendModes = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "difference",
  "luminosity",
];

export default function BlendModeSelector({ selectedElement, onSelectBlend }) {
  if (!selectedElement) return null;

  return (
    <div className="blendmode-selector">
      <h6>Blend Mode</h6>
      <div className="blend-grid">
        {blendModes.map((mode) => (
          <div
            key={mode}
            className={`blend-thumb ${selectedElement.blendMode === mode ? "active" : ""}`}
            style={{
              backgroundImage: selectedElement.url ? `url(${selectedElement.url})` : undefined,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              mixBlendMode: mode,
            }}
            title={mode}
            onClick={() => onSelectBlend(mode)}
          >
            <span>{mode}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


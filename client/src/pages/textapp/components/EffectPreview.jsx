// src/pages/textapp/components/EffectPreview.jsx
import React from "react";
import "./EffectPreview.css";
import "./EffectPreset.css";

export default function EffectPreview({ preset, onApply, onHover, layerStyle = {} }) {
  // a tiny inline sample text for the thumbnail
  const sample = (layerStyle && layerStyle.sampleText) || "Aa";

  // build gradient background for the preset button
  const bg = `linear-gradient(90deg, ${preset.palette.join(",")})`;

  return (
    <div
      className="effect-preview"
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
    >
      <button
        className="effect-thumb"
        onClick={() => onApply && onApply()}
        style={{ background: bg }}
        title={preset.label}
      >
        <div className="thumb-inner">
          <div
            className="thumb-sample"
            style={{
              fontFamily: layerStyle?.fontFamily || "inherit",
              fontWeight: layerStyle?.fontWeight || 400,
              fontSize: 14,
              lineHeight: "18px"
            }}
          >
            {sample}
          </div>
          <div className="thumb-label">{preset.label}</div>
        </div>
      </button>
    </div>
  );
}

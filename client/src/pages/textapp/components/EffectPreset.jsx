// src/components/EffectPreset.jsx
// src/components/EffectPreset.jsx
import React from 'react';
import './EffectPreset.css';

export default function EffectPreset({ preset, onCreate, onApply }) {
  return (
    <div className="effect-preset">
      <button
        className="effect-btn"
        onClick={() => {
          onCreate && onCreate(preset);  // create new template
          onApply && onApply(preset.id); // apply effect real-time
        }}
        style={{ background: `linear-gradient(90deg, ${preset.palette.join(',')})` }}
      >
        {preset.label}
      </button>
    </div>
  );
}




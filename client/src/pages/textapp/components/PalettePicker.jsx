// src/components/PalettePicker.jsx
// src/components/PalettePicker.jsx
import React, { useState } from 'react';
import './variables.css';
import './PalettePicker.css';

export default function PalettePicker({ palette = [], onChange }) {
  const [colors, setColors] = useState(palette.length ? palette : ['#ff7a18','#ffd200']);

  function addColor() { 
    const newColors = [...colors, '#ffffff'];
    setColors(newColors);
    onChange?.(newColors);
  }

  function update(i, val) { 
    const newColors = [...colors];
    newColors[i] = val;
    setColors(newColors);
    onChange?.(newColors);
  }

  return (
    <div className="palette-picker">
      <h4>Palette</h4>
      <div className="palette-row">
        {colors.map((c,i)=> (
          <input key={i} type="color" value={c} onChange={(e)=>update(i,e.target.value)} />
        ))}
        <button className="btn" onClick={addColor}>Add</button>
      </div>
    </div>
  );
}





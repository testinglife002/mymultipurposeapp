// src/appcomponents/LayersPanel.jsx
import React from "react";
import { Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import "./LayersPanel.css";

const LayersPanel = ({
  components,
  currentComponent,
  setCurrentComponent,
  removeComponent,
  bringForward,
  sendBackward,
  toggleVisibility,
  toggleLock,
}) => {
  return (
    <div className="layers-panel" style={{marginLeft:'75%'}} >
      <div className="layers-header">Layers</div>
      <div className="layers-list">
        {components
          .filter((c) => c.name !== "main_frame")
          .sort((a, b) => b.z_index - a.z_index)
          .map((layer) => (
            <div
              key={layer.id}
              className={`layer-item ${
                currentComponent?.id === layer.id ? "active" : ""
              }`}
              onClick={() => setCurrentComponent(layer)}
            >
              <div className="layer-name">
                {layer.name} ({layer.type})
              </div>
              <div className="layer-actions">
                <button onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}>
                  {layer.hidden ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleLock(layer.id); }}>
                  {layer.locked ? <Lock size={16}/> : <Unlock size={16}/>}
                </button>
                <button onClick={(e) => { e.stopPropagation(); bringForward(layer.id); }}>
                  <ArrowUp size={16}/>
                </button>
                <button onClick={(e) => { e.stopPropagation(); sendBackward(layer.id); }}>
                  <ArrowDown size={16}/>
                </button>
                <button onClick={(e) => { e.stopPropagation(); removeComponent(layer.id); }}>
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LayersPanel;

// LayersPanel.jsx (shows thumbnails + text previews + blend mode)
// LayersPanel.jsx
import React, { useRef } from "react";
import Draggable from "react-draggable";
import "./LayersPanel.css";

export default function LayersPanel({ bg, main, layers, texts, selected, setSelected }) {
  const nodeRef = useRef(null); // ✅ create ref for draggable root

  const allItems = [
    { id: "background", label: "Background", type: "background", thumb: bg.url },
    { id: "main", label: "Main Image", type: "main", thumb: main.url },
    ...layers.map((l) => ({ ...l, label: `Layer ${l.id}` })),
    ...texts.map((t) => ({ ...t, label: t.text || "Text" })),
  ];

  return (
    <Draggable handle=".layers-header" nodeRef={nodeRef}>
      <div className="layers-panel" ref={nodeRef}>
        <div className="layers-header">
          <h6>Layers</h6>
        </div>
        {allItems.map((item) => (
          <div
            key={item.id}
            className={`layer-item ${
              selected.id === item.id && selected.type === item.type ? "active" : ""
            }`}
            onClick={() => setSelected({ type: item.type, id: item.id })}
          >
            {item.thumb ? (
              <div
                className="layer-thumb"
                style={{ backgroundImage: `url(${item.thumb})` }}
              />
            ) : (
              <div className="layer-thumb-text">{item.label[0]}</div>
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </Draggable>
  );
}




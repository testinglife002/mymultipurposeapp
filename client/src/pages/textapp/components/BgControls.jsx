// src/pages/textapp/components/BgControls.jsx
// src/pages/textapp/components/BgControls.jsx
// src/pages/textapp/components/BgControls.jsx
import React, { useState, useEffect } from "react";
import "./BgControls.css";

export default function BgControls({
  overlayScale,
  textBgScale,
  showOverlay,
  showTextBg,
  setOverlayScale,
  setTextBgScale,
  setShowOverlay,
  setShowTextBg,
  selectedLayerObj,
  onUpdateLayer,
}) {

     const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 280, y: 80 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // floating drag
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div
      className={`bg-controls ${visible ? "visible" : ""}`}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
    <div className="bg-controls-section">
      <h3>🎛 Background & Text Controls</h3>

      {/* Background Overlay */}
      <div className="control-group">
        <label>
          Overlay Scale
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={overlayScale}
            onChange={(e) => setOverlayScale(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Show Overlay
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={() => setShowOverlay((p) => !p)}
          />
        </label>
      </div>

      {/* Text Background */}
      <div className="control-group">
        <label>
          Text BG Scale
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={textBgScale}
            onChange={(e) => setTextBgScale(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Show Text BG
          <input
            type="checkbox"
            checked={showTextBg}
            onChange={() => setShowTextBg((p) => !p)}
          />
        </label>
      </div>

      {/* Selected Layer */}
      {selectedLayerObj && (
        <div className="control-group">
          <label>
            Opacity
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={selectedLayerObj.opacity ?? 1}
              onChange={(e) =>
                onUpdateLayer(selectedLayerObj.id, "opacity", parseFloat(e.target.value))
              }
            />
          </label>
          <label>
            Blur
            <input
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={selectedLayerObj.blur ?? 0}
              onChange={(e) =>
                onUpdateLayer(selectedLayerObj.id, "blur", parseFloat(e.target.value))
              }
            />
          </label>
          <label>
            Z-Index
            <input
              type="number"
              min={0}
              max={100}
              value={selectedLayerObj.zIndex ?? 0}
              onChange={(e) =>
                onUpdateLayer(selectedLayerObj.id, "zIndex", parseInt(e.target.value))
              }
            />
          </label>
        </div>
      )}
    </div>
    </div>
  );
}



// 📄 BannerMakerAlt.jsx
import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import "./BannerMakerAlt.css";

const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "difference",
  "color-dodge",
  "soft-light",
  "luminosity",
];

export default function BannerMakerAlt() {
  const [layers, setLayers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef(null);
  const pointerRef = useRef({});

  // 🧩 Utility — push to history
  const pushHistory = (snapshot) => {
    const copy = JSON.parse(JSON.stringify(snapshot));
    const next = history.slice(0, historyIndex + 1).concat([copy]);
    setHistory(next);
    setHistoryIndex(next.length - 1);
  };

  // 🔙 Undo / Redo
  const undo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setLayers(JSON.parse(JSON.stringify(history[idx])));
      setHistoryIndex(idx);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setLayers(JSON.parse(JSON.stringify(history[idx])));
      setHistoryIndex(idx);
    }
  };

  // 🖼️ Add a new layer
  const handleAddLayer = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = Date.now().toString();
    const newLayer = {
      id,
      url,
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      scale: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
      opacity: 1,
      blendMode: "normal",
      filter: "none",
      zIndex: layers.length,
    };
    const updated = [...layers, newLayer];
    setLayers(updated);
    setActiveId(id);
    pushHistory(updated);
  };

  // 🔍 Active layer
  const activeLayer = layers.find((l) => l.id === activeId);

  // ✋ Pointer events for drag/resize
  const onPointerDown = (e, id, mode) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const layer = layers.find((l) => l.id === id);
    pointerRef.current = {
      id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      start: { ...layer },
      rect,
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    const p = pointerRef.current;
    if (!p.id) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== p.id) return l;
        const updated = { ...l };
        if (p.mode === "move") {
          updated.x = p.start.x + dx;
          updated.y = p.start.y + dy;
        } else if (p.mode === "resize") {
          updated.width = Math.max(50, p.start.width + dx);
          updated.height = Math.max(50, p.start.height + dy);
        }
        return updated;
      })
    );
  };

  const onPointerUp = () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    if (pointerRef.current.id) {
      pushHistory(layers);
      pointerRef.current = {};
    }
  };

  // 💾 Export functions
  const exportCanvas = async () => {
    const node = canvasRef.current;
    if (!node) return;
    const dataUrl = await toPng(node);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "banner.png";
    a.click();
  };

  // 🧠 Draw main preview
  const drawCanvas = () => {
    // Re-rendering handled via React
  };

  useEffect(drawCanvas, [layers]);

  // 🎨 Apply blend mode preview
  const handleApplyBlend = (blend) => {
    if (!activeLayer) return;
    setLayers((prev) =>
      prev.map((l) => (l.id === activeId ? { ...l, blendMode: blend } : l))
    );
    pushHistory(
      layers.map((l) => (l.id === activeId ? { ...l, blendMode: blend } : l))
    );
  };

  // 🧰 Controls
  const handleTransformChange = (field, value) => {
    if (!activeLayer) return;
    const updated = layers.map((l) =>
      l.id === activeId ? { ...l, [field]: value } : l
    );
    setLayers(updated);
    pushHistory(updated);
  };

  // 🪞 Flip handlers
  const flip = (axis) => {
    if (!activeLayer) return;
    const updated = layers.map((l) => {
      if (l.id !== activeId) return l;
      return axis === "h"
        ? { ...l, flipH: !l.flipH }
        : { ...l, flipV: !l.flipV };
    });
    setLayers(updated);
    pushHistory(updated);
  };

  return (
    <div className="banner-maker">
      <div className="toolbar">
        <label className="upload-btn">
          + Add Image
          <input type="file" accept="image/*" onChange={handleAddLayer} hidden />
        </label>
        <button onClick={undo} disabled={historyIndex <= 0}>
          Undo
        </button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1}>
          Redo
        </button>
        <button onClick={exportCanvas}>Export</button>
      </div>

      <div className="workspace">
        <div className="canvas" id="canvas" ref={canvasRef}>
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`layer ${activeId === layer.id ? "active" : ""}`}
              style={{
                left: layer.x,
                top: layer.y,
                width: layer.width,
                height: layer.height,
                zIndex: layer.zIndex,
                transform: `scale(${layer.scale}) rotate(${layer.rotation}deg)
                  scaleX(${layer.flipH ? -1 : 1}) scaleY(${layer.flipV ? -1 : 1})`,
                opacity: layer.opacity,
                mixBlendMode: layer.blendMode,
                filter: layer.filter,
              }}
              onPointerDown={(e) => {
                setActiveId(layer.id);
                onPointerDown(e, layer.id, "move");
              }}
            >
              <img src={layer.url} alt="" draggable={false} />
              {activeId === layer.id && (
                <div
                  className="resize-handle"
                  onPointerDown={(e) => onPointerDown(e, layer.id, "resize")}
                />
              )}
            </div>
          ))}
        </div>

        {activeLayer && (
          <div className="controls">
            <h3>Layer Controls</h3>
            <div className="control-group">
              <label>Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeLayer.opacity}
                onChange={(e) =>
                  handleTransformChange("opacity", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="control-group">
              <label>Scale</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={activeLayer.scale}
                onChange={(e) =>
                  handleTransformChange("scale", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="control-group">
              <label>Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                value={activeLayer.rotation}
                onChange={(e) =>
                  handleTransformChange("rotation", parseInt(e.target.value))
                }
              />
            </div>
            <div className="control-group">
              <label>Filter</label>
              <select
                value={activeLayer.filter}
                onChange={(e) => handleTransformChange("filter", e.target.value)}
              >
                <option value="none">None</option>
                <option value="grayscale(1)">Grayscale</option>
                <option value="sepia(1)">Sepia</option>
                <option value="contrast(1.5)">High Contrast</option>
                <option value="blur(2px)">Blur</option>
              </select>
            </div>
            <div className="control-group">
              <button onClick={() => flip("h")}>Flip H</button>
              <button onClick={() => flip("v")}>Flip V</button>
            </div>

            <div className="blend-previews">
              {BLEND_MODES.slice(0, 5).map((mode) => (
                <button
                  key={mode}
                  className={`blend-btn ${
                    activeLayer.blendMode === mode ? "selected" : ""
                  }`}
                  onClick={() => handleApplyBlend(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
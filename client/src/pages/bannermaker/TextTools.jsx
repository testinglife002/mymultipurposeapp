// TextTools.jsx (add new text immediately selectable)
import React, { useState, useEffect } from "react";
import "./TextTools.css";

const fonts = ["Arial", "Verdana", "Tahoma", "Courier New", "Georgia", "Impact"];

export default function TextTools({ texts, setTexts, selected, setSelected }) {
  const [newText, setNewText] = useState("");
  const [font, setFont] = useState("Arial");
  const [bgColor, setBgColor] = useState("#000000");
  const [color, setColor] = useState("#ffffff");

  // Update selected text properties whenever font/color/bgColor changes
  useEffect(() => {
    if (!selected?.id) return;
    setTexts((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, font, color, bgColor }
          : t
      )
    );
  }, [font, color, bgColor, selected?.id, setTexts]);

  const addText = () => {
    if (!newText.trim()) return;
    const t = {
      id: Date.now(),
      type: "text",
      text: newText,
      x: 200,
      y: 200,
      w: 150,
      h: 50,
      size: 32,
      color,
      font,
      bgColor,
      opacity: 1,
      rotation: 0,
      scale: 1,
      blendMode: "normal",
    };
    setTexts([...texts, t]);
    setSelected({ type: "text", id: t.id });
    setNewText("");
  };

  const selectedText = texts.find((t) => t.id === selected?.id);

  return (
    <div className="text-tools">
      <h6>Text Tools</h6>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter text"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
      />

      <label>Font</label>
      <select
        className="form-control mb-2"
        value={font}
        onChange={(e) => setFont(e.target.value)}
      >
        {fonts.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <label>Font Color</label>
      <input
        type="color"
        className="form-control mb-2"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <label>Background Color</label>
      <input
        type="color"
        className="form-control mb-2"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
      />

      {selectedText && (
        <>
            <label>Scale</label>
            <input
            type="number"
            step="0.1"
            className="form-control mb-2"
            value={selectedText.scale}
            onChange={(e) =>
                setTexts(
                texts.map((t) =>
                    t.id === selectedText.id
                    ? { ...t, scale: Number(e.target.value) }
                    : t
                )
                )
            }
            />

            <label>Rotation (deg)</label>
            <input
            type="number"
            step="1"
            className="form-control mb-2"
            value={selectedText.rotation}
            onChange={(e) =>
                setTexts(
                texts.map((t) =>
                    t.id === selectedText.id
                    ? { ...t, rotation: Number(e.target.value) }
                    : t
                )
                )
            }
            />
        </>
        )}


      <button className="btn btn-sm btn-primary w-100" onClick={addText}>
        Add Text
      </button>
    </div>
  );
}


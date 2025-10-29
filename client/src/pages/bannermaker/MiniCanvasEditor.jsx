// MiniCanvasEditor.jsx
import React from "react";

export default function MiniCanvasEditor({ texts, selected, setTexts, setSelected, scale = 0.2 }) {
  const handleDrag = (e, t) => {
    e.stopPropagation();
    setSelected({ type: "text", id: t.id });
    const startX = e.clientX,
      startY = e.clientY;
    const origX = t.x,
      origY = t.y;

    const handleMove = (ev) =>
      setTexts((prev) =>
        prev.map((txt) =>
          txt.id === t.id
            ? { ...txt, x: origX + (ev.clientX - startX) / scale, y: origY + (ev.clientY - startY) / scale }
            : txt
        )
      );

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleRotate = (e, t) => {
    e.stopPropagation();
    setSelected({ type: "text", id: t.id });

    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const startRotation = t.rotation || 0;

    const handleMove = (ev) => {
      const currentAngle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI);
      const delta = currentAngle - startAngle;
      setTexts((prev) => prev.map((txt) => (txt.id === t.id ? { ...txt, rotation: startRotation + delta } : txt)));
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return (
    <div
      style={{
        width: 180,
        height: 120,
        border: "1px solid #ccc",
        position: "relative",
        background: "#222",
      }}
    >
      {texts.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            left: t.x * scale,
            top: t.y * scale,
            width: (t.w || 150) * t.scale * scale,
            height: (t.h || 50) * t.scale * scale,
            backgroundColor: t.bgColor,
            color: t.color,
            fontSize: t.size * t.scale * scale,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            cursor: "grab",
            border: selected.id === t.id ? "1px solid #0f0" : "none",
            overflow: "hidden",
            whiteSpace: "nowrap",
            transform: `rotate(${t.rotation || 0}deg)`,
          }}
          onMouseDown={(e) => handleDrag(e, t)}
          onClick={() => setSelected({ type: "text", id: t.id })}
        >
          {t.text}
          {selected.id === t.id && (
            <div className="rotate-handle" onMouseDown={(e) => handleRotate(e, t)} />
          )}
        </div>
      ))}
    </div>
  );
}



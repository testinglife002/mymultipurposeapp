// CanvasEditor.jsx (Drag & Drop works for text)
import React from "react";
import "./CanvasEditor.css";

export default function CanvasEditor({
  bg,
  setBg,
  main,
  setMain,
  layers,
  setLayers,
  texts,
  setTexts,
  selected,
  setSelected,
}) {
  // Generic drag handler for images
  const handleDrag = (e, item, setItem) => {
    e.stopPropagation();
    setSelected({ type: item.type, id: item.id });

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = item.x;
    const origY = item.y;

    const handleMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setItem((p) => ({ ...p, x: origX + dx, y: origY + dy }));
    };
    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // Drag handler for text
  const handleTextDrag = (e, t) => {
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
            ? { ...txt, x: origX + ev.clientX - startX, y: origY + ev.clientY - startY }
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

  // Rotate handler (shared for images & text)
  const handleRotate = (e, item, setItem) => {
    e.stopPropagation();
    setSelected({ type: item.type, id: item.id });

    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const startRotation = item.rotation || 0;

    const handleMove = (ev) => {
      const currentAngle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI);
      const delta = currentAngle - startAngle;
      setItem((p) => ({ ...p, rotation: startRotation + delta }));
    };

    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // Render text element
  const renderText = (t) => {
    const style = {
      position: "absolute",
      top: t.y,
      left: t.x,
      width: (t.w || 150) * t.scale,
      height: (t.h || 50) * t.scale,
      transform: `rotate(${t.rotation || 0}deg)`,
      fontSize: t.size * t.scale,
      fontFamily: t.font,
      color: t.color,
      backgroundColor: t.bgColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderRadius: 4,
      cursor: "grab",
      zIndex: 1000,
      userSelect: "none",
    };
    return (
      <div
        key={t.id}
        className="text-element"
        style={style}
        onMouseDown={(e) => handleTextDrag(e, t)}
      >
        {t.text}
        {selected.id === t.id && (
          <>
            <div className="rotate-handle" onMouseDown={(e) => handleRotate(e, t, setTexts)} />
            <span className="text-coords">X:{Math.round(t.x)}, Y:{Math.round(t.y)}</span>
          </>
        )}
      </div>
    );
  };

  // Render images & layers
  const renderElement = (item, setItem) => {
    const style = {
      position: "absolute",
      top: item.y,
      left: item.x,
      width: (item.w || 100) * item.scale,
      height: (item.h || 50) * item.scale,
      transform: `rotate(${item.rotation || 0}deg)`,
      opacity: item.opacity || 1,
      mixBlendMode: item.blendMode || "normal",
      backgroundImage: `url(${item.url})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      cursor: "grab",
      zIndex: selected.id === item.id ? 999 : 1,
    };

    return (
      <div
        key={item.id}
        className={`canvas-item ${selected.id === item.id ? "selected" : ""}`}
        style={style}
        onMouseDown={(e) => handleDrag(e, item, setItem)}
      >
        {selected.id === item.id && (
          <>
            <div className="resize-handle" onMouseDown={(e) => handleRotate(e, item, setItem)} />
            <div className="rotate-handle" onMouseDown={(e) => handleRotate(e, item, setItem)} />
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className="canvas"
      style={{ width: bg.w, height: bg.h }}
      onMouseDown={() => setSelected({ type: null, id: null })}
    >
      {bg.url && renderElement(bg, setBg)}
      {main.url && renderElement(main, setMain)}
      {layers.map((l) =>
        renderElement(l, (v) => setLayers((prev) => prev.map((p) => (p.id === l.id ? v : p))))
      )}
      {texts.map(renderText)}
    </div>
  );
}



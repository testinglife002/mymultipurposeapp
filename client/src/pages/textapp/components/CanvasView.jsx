  // src/components/CanvasView.jsx
  // src/pages/textapp/components/CanvasView.jsx
  // src/components/CanvasView.jsx
  // src/components/CanvasView.jsx
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { wrapLettersMultiLine } from "../../../utils/wrapLetters";
import newRequest from "../../../api/newRequest";
import "./CanvasView.css";
import "./effects/index.css";
import BgControls from "./BgControls";

export default function CanvasView({
  id,
  layers = [],
  template,
  selectedLayer,
  hoverEffect,
  showOverlay: parentShowOverlay = true,
  onSelectLayer,
  onUpdateLayer,
  onSaveTemplate,
  showBgControls
}) {
  const rootRef = useRef(null);
  const textRefs = useRef({});
  const [activeDrag, setActiveDrag] = useState(null);
  const [activeResize, setActiveResize] = useState(null);
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [overlayScale, setOverlayScale] = useState(1.5);
  const [textBgScale, setTextBgScale] = useState(1.5);
  const [showOverlay, setShowOverlay] = useState(parentShowOverlay);
  const [showTextBg, setShowTextBg] = useState(true);

  useEffect(() => setShowOverlay(parentShowOverlay), [parentShowOverlay]);

  useEffect(() => {
    layers.forEach((l) => {
      if (!textRefs.current[l.id]) textRefs.current[l.id] = React.createRef();
    });
  }, [layers]);

  const selectedLayerObj = layers.find((l) => l.id === selectedLayer) || null;

  const pctToPx = (xPct, yPct) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (xPct / 100) * r.width, y: (yPct / 100) * r.height };
  };
  const pxToPct = (pxX, pxY) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (pxX / r.width) * 100, y: (pxY / r.height) * 100 };
  };
  const ensureBox = (layer) => {
    if (layer.width && layer.height) return { width: layer.width, height: layer.height };
    const dom = textRefs.current[layer.id]?.current;
    if (dom) {
      const rect = dom.getBoundingClientRect();
      return { width: Math.max(80, rect.width), height: Math.max(30, rect.height) };
    }
    return { width: 300, height: 80 };
  };

  // Drag / Resize handlers
  const onPointerDownDrag = (e, layer) => {
    e.stopPropagation();
    setActiveDrag({ id: layer.id, startX: e.clientX, startY: e.clientY, startLayer: { x: layer.x, y: layer.y } });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerDownResize = (e, layer, corner) => {
    e.stopPropagation();
    setActiveResize({
      id: layer.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      startBox: ensureBox(layer),
      startLayer: { x: layer.x, y: layer.y },
    });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const onPointerMove = (ev) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();

      if (activeDrag) {
        const { id, startX, startY, startLayer } = activeDrag;
        const dxPct = ((ev.clientX - startX) / rect.width) * 100;
        const dyPct = ((ev.clientY - startY) / rect.height) * 100;
        onUpdateLayer(id, "x", Math.max(0, Math.min(100, startLayer.x + dxPct)));
        onUpdateLayer(id, "y", Math.max(0, Math.min(100, startLayer.y + dyPct)));
        return;
      }

      if (activeResize) {
        const { id, corner, startX, startY, startBox, startLayer } = activeResize;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let newW = startBox.width;
        let newH = startBox.height;
        let deltaX = 0, deltaY = 0;

        if (corner === "br") { newW += dx; newH += dy; }
        else if (corner === "bl") { newW -= dx; newH += dy; deltaX = dx / 2; }
        else if (corner === "tr") { newW += dx; newH -= dy; deltaY = dy / 2; }
        else if (corner === "tl") { newW -= dx; newH -= dy; deltaX = dx / 2; deltaY = dy / 2; }

        const centerPx = pctToPx(startLayer.x, startLayer.y);
        const newCenter = pxToPct(centerPx.x + deltaX, centerPx.y + deltaY);

        onUpdateLayer(id, "width", Math.max(20, Math.round(newW)));
        onUpdateLayer(id, "height", Math.max(10, Math.round(newH)));
        onUpdateLayer(id, "x", newCenter.x);
        onUpdateLayer(id, "y", newCenter.y);
        const newFontSize = Math.max(8, Math.round(newH * 0.45));
        onUpdateLayer(id, "fontSize", newFontSize);
      }
    };
    const onPointerUp = () => { setActiveDrag(null); setActiveResize(null); };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [activeDrag, activeResize, onUpdateLayer]);

  // Per-letter text effects
  const renderTextHtml = (layer) => {
    const perLetterEffects = ["wavy", "shimmer", "glitch", "fire", "gooeyMarquee"];
    if (perLetterEffects.includes(layer.effect)) {
      return { __html: wrapLettersMultiLine(layer.text || "", layer.effect, 0.05, "transparent") };
    }
    const escaped = (layer.text || "").replace(/\n/g, "<br/>");
    return { __html: `<span class="${layer.effect || ""}" data-text="${layer.text}">${escaped}</span>` };
  };

  const exportPNG = async () => {
    const node = document.getElementById(id);
    if (!node) return;
    const canvas = await html2canvas(node, { useCORS: true, scale: 3, backgroundColor: null });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.png";
    a.click();
  };

  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await newRequest.post("/text-templates/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const bgLayer = layers.find((l) => l.type === "background");
    if (bgLayer) onUpdateLayer(bgLayer.id, "url", res.data.url);
  };

  const saveTemplate = async () => {
    try {
      const payload = {
        name: template?.name || `Template ${Date.now()}`,
        layers,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (template?._id) {
        await newRequest.put(`/text-templates/${template._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Template updated!");
      } else {
        const res = await newRequest.post("/text-templates", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Template saved!");
      }
      onSaveTemplate?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    }
  };

  const saveAsNewTemplate = async () => {
    try {
      const payload = {
        name: `${template?.name || "Template"} Copy`,
        layers,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      const res = await newRequest.post("/text-templates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Saved as new template!");
      onSaveTemplate?.(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to save as new template");
    }
  };

  // Canvas Rendering
  return (
    <div className="canvas-container">
    <div
      id={id}
      ref={rootRef}
      className="canvas-view"
      style={{ position: "relative", userSelect: activeDrag || activeResize ? "none" : "auto" }}
      onClick={() => onSelectLayer?.(null)}
    >
      {/* Background Images */}
      {layers.filter(l => l.type === "background" && l.url).map(bg => (
        <img
          key={bg.id}
          src={bg.url}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(${bg.blur || 0}px)`,
            opacity: bg.opacity ?? 1,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Text Layers */}
      {layers.filter(l => l.type === "text").sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).map(layer => {
        const { width, height } = ensureBox(layer);
        const { x, y } = pctToPx(layer.x ?? 50, layer.y ?? 50);
        const left = x - width / 2;
        const top = y - height / 2;
        const isSelected = selectedLayer === layer.id;

        const overlay = showOverlay ? {
          position: "absolute",
          left: left - ((width * 0.075 * overlayScale) / 2),
          top: top - ((height * 0.35 * overlayScale) / 2),
          width: width * (1 + 0.075 * overlayScale),
          height: height * (1 + 0.35 * overlayScale),
          borderRadius: 10,
          background: layer.palette?.length > 1 ? `linear-gradient(90deg, ${layer.palette.join(",")})` : "rgba(0,0,0,0.5)",
          zIndex: (layer.zIndex ?? 0) + 5,
          filter: "blur(8px)",
        } : null;

        const textBg = showTextBg ? {
          position: "absolute",
          left: -((width * 0.075 * textBgScale) / 2),
          top: -((height * 0.35 * textBgScale) / 2),
          width: width * (1 + 0.075 * textBgScale),
          height: height * (1 + 0.35 * textBgScale),
          zIndex: -1,
          borderRadius: 8,
          background: layer.palette?.length > 1 ? `linear-gradient(90deg, ${layer.palette.join(",")})` : layer.palette?.[0] || "rgba(0,0,0,0.3)",
        } : null;

        return (
          <React.Fragment key={layer.id}>
            {overlay && <div style={overlay} />}
            <div
              ref={textRefs.current[layer.id]}
              className={`text-layer ${isSelected ? "selected" : ""} ${hoveredLayer === layer.id ? "hovered" : ""}`}
              style={{
                position: "absolute",
                left,
                top,
                width,
                height,
                zIndex: (layer.zIndex ?? 0) + 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "move",
                touchAction: "none",
              }}
              onPointerDown={(e) => onPointerDownDrag(e, layer)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              onClick={(e) => { e.stopPropagation(); onSelectLayer?.(layer.id); }}
            >
              {textBg && <div style={textBg} />}
              <div
                className={`text-content ${layer.effect} ${hoverEffect === layer.effect ? "hover" : ""}`}
                style={{
                  fontSize: `${layer.fontSize ?? 24}px`,
                  fontFamily: layer.fontFamily || "inherit",
                  fontWeight: layer.fontWeight || 400,
                  textAlign: "center",
                  lineHeight: 1.1,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  color: showTextBg && layer.palette?.length === 1 ? layer.palette[0] : "#fff",
                  background: showTextBg && layer.palette?.length > 1 ? `linear-gradient(90deg, ${layer.palette.join(",")})` : "none",
                  WebkitBackgroundClip: showTextBg && layer.palette?.length > 1 ? "text" : "initial",
                  WebkitTextFillColor: showTextBg && layer.palette?.length > 1 ? "transparent" : "inherit",
                }}
                dangerouslySetInnerHTML={renderTextHtml(layer)}
              />
            </div>
          </React.Fragment>
        );
      })}




      {/* Controls */}
      <div className="canvas-controls" 
       // style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 0 }}
      >

        

      

            {/* ==== Controls Section (below canvas) ==== */}
      <div className="controls-section">
        <BgControls
          overlayScale={overlayScale}
          textBgScale={textBgScale}
          showOverlay={showOverlay}
          showTextBg={showTextBg}
          setOverlayScale={setOverlayScale}
          setTextBgScale={setTextBgScale}
          setShowOverlay={setShowOverlay}
          setShowTextBg={setShowTextBg}
          selectedLayerObj={selectedLayerObj}
          onUpdateLayer={onUpdateLayer}
        />
      </div>

      </div>

      

    </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", background:'white' }}>
        <button className="btn" onClick={exportPNG}>Export PNG</button>
        <button className="btn" onClick={saveTemplate}>💾 Save</button>
        <button className="btn" onClick={saveAsNewTemplate}>🆕 Save As New Template</button>
        <label className="btn">
          Upload BG
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleBgUpload} />
        </label>
      </div>

    </div>
  );
}





/*  
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { wrapLettersMultiLine } from "../../../utils/wrapLetters";
import newRequest from "../../../api/newRequest";
import "./CanvasView.css";
import "./effects/index.css";

export default function CanvasView({
  id,
  layers = [],
  template,
  selectedLayer,
  hoverEffect,
  showOverlay: parentShowOverlay = true,
  onSelectLayer,
  onUpdateLayer,
  onSaveTemplate,
}) {
  const rootRef = useRef(null);
  const textRefs = useRef({});
  const [activeDrag, setActiveDrag] = useState(null);
  const [activeResize, setActiveResize] = useState(null);
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [overlayScale, setOverlayScale] = useState(1.5);
  const [textBgScale, setTextBgScale] = useState(1.5);
  const [showOverlay, setShowOverlay] = useState(parentShowOverlay);
  const [showTextBg, setShowTextBg] = useState(true);

  useEffect(() => setShowOverlay(parentShowOverlay), [parentShowOverlay]);

  useEffect(() => {
    layers.forEach((l) => {
      if (!textRefs.current[l.id]) textRefs.current[l.id] = React.createRef();
    });
  }, [layers]);

  // NOTE: previously this component attempted to "initialize" parent via onUpdateLayer(..., 'init', l)
  // That is removed because parent (TextApp) already sets layers based on selected template.
  // CanvasView will treat `layers` as source-of-truth for rendering and user interactions.


  const pctToPx = (xPct, yPct) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (xPct / 100) * r.width, y: (yPct / 100) * r.height };
  };
  const pxToPct = (pxX, pxY) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (pxX / r.width) * 100, y: (pxY / r.height) * 100 };
  };
  const ensureBox = (layer) => {
    if (layer.width && layer.height) return { width: layer.width, height: layer.height };
    const dom = textRefs.current[layer.id]?.current;
    if (dom) {
      const rect = dom.getBoundingClientRect();
      return { width: Math.max(80, rect.width), height: Math.max(30, rect.height) };
    }
    return { width: 300, height: 80 };
  };


  // Drag / Resize handlers
  const onPointerDownDrag = (e, layer) => {
    e.stopPropagation();
    setActiveDrag({ id: layer.id, startX: e.clientX, startY: e.clientY, startLayer: { x: layer.x, y: layer.y } });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerDownResize = (e, layer, corner) => {
    e.stopPropagation();
    setActiveResize({
      id: layer.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      startBox: ensureBox(layer),
      startLayer: { x: layer.x, y: layer.y },
    });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const onPointerMove = (ev) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();

      if (activeDrag) {
        const { id, startX, startY, startLayer } = activeDrag;
        const dxPct = ((ev.clientX - startX) / rect.width) * 100;
        const dyPct = ((ev.clientY - startY) / rect.height) * 100;
        onUpdateLayer(id, "x", Math.max(0, Math.min(100, startLayer.x + dxPct)));
        onUpdateLayer(id, "y", Math.max(0, Math.min(100, startLayer.y + dyPct)));
        return;
      }

      if (activeResize) {
        const { id, corner, startX, startY, startBox, startLayer } = activeResize;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let newW = startBox.width;
        let newH = startBox.height;
        let deltaX = 0,
          deltaY = 0;

        if (corner === "br") { newW += dx; newH += dy; }
        else if (corner === "bl") { newW -= dx; newH += dy; deltaX = dx / 2; }
        else if (corner === "tr") { newW += dx; newH -= dy; deltaY = dy / 2; }
        else if (corner === "tl") { newW -= dx; newH -= dy; deltaX = dx / 2; deltaY = dy / 2; }

        const centerPx = pctToPx(startLayer.x, startLayer.y);
        const newCenter = pxToPct(centerPx.x + deltaX, centerPx.y + deltaY);

        onUpdateLayer(id, "width", Math.max(20, Math.round(newW)));
        onUpdateLayer(id, "height", Math.max(10, Math.round(newH)));
        onUpdateLayer(id, "x", newCenter.x);
        onUpdateLayer(id, "y", newCenter.y);
        const newFontSize = Math.max(8, Math.round(newH * 0.45));
        onUpdateLayer(id, "fontSize", newFontSize);
      }
    };
    const onPointerUp = () => { setActiveDrag(null); setActiveResize(null); };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [activeDrag, activeResize, onUpdateLayer]);


  // Render per-letter effects
  const renderTextHtml = (layer) => {
    const perLetterEffects = ["wavy", "shimmer", "glitch", "fire", "gooeyMarquee"];
    if (perLetterEffects.includes(layer.effect)) {
      return { __html: wrapLettersMultiLine(layer.text || "", layer.effect, 0.05, "transparent") };
    }
    const escaped = (layer.text || "").replace(/\n/g, "<br/>");
    return { __html: `<span class="${layer.effect || ""}" data-text="${layer.text}">${escaped}</span>` };
  };

  const exportPNG = async () => {
    const node = document.getElementById(id);
    if (!node) return;
    const canvas = await html2canvas(node, { useCORS: true, scale: 3, backgroundColor: null });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.png";
    a.click();
  };

  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await newRequest.post("/text-templates/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const bgLayer = layers.find((l) => l.type === "background");
    if (bgLayer) onUpdateLayer(bgLayer.id, "url", res.data.url);
  };

  const saveTemplate = async () => {
    try {
      const payload = {
        name: template?.name || `Template ${Date.now()}`,
        layers,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (template?._id) {
        await newRequest.put(`/text-templates/${template._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Template updated!");
      } else {
        const res = await newRequest.post("/text-templates", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Template saved!");
      }
      onSaveTemplate?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    }
  };

  const saveAsNewTemplate = async () => {
    try {
      const payload = {
        name: `${template?.name || "Template"} Copy`,
        layers,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      const res = await newRequest.post("/text-templates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Saved as new template!");
      onSaveTemplate?.(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to save as new template");
    }
  };


  return (
    <div
      id={id}
      ref={rootRef}
      className="canvas-view"
      style={{ position: "relative", userSelect: activeDrag || activeResize ? "none" : "auto" }}
      onClick={() => onSelectLayer?.(null)}
    >
      {layers.filter(l => l.type === "background" && l.url).map(bg => (
        <img
          key={bg.id}
          src={bg.url}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `blur(${bg.blur || 0}px)`,
            opacity: bg.opacity ?? 1,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      ))}

      {layers.filter(l => l.type === "text").sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)).map(layer => {
        const { width, height } = ensureBox(layer);
        const { x, y } = pctToPx(layer.x ?? 50, layer.y ?? 50);
        const left = x - width / 2;
        const top = y - height / 2;
        const isSelected = selectedLayer === layer.id;

        const overlay = showOverlay ? {
          position: "absolute",
          left: left - ((width * 0.075 * overlayScale) / 2),
          top: top - ((height * 0.35 * overlayScale) / 2),
          width: width * (1 + 0.075 * overlayScale),
          height: height * (1 + 0.35 * overlayScale),
          borderRadius: 10,
          background: layer.palette?.length > 1 ? `linear-gradient(90deg, ${layer.palette.join(",")})` : "rgba(0,0,0,0.5)",
          zIndex: (layer.zIndex ?? 0) + 5,
          filter: "blur(8px)",
        } : null;

        const textBg = showTextBg ? {
          position: "absolute",
          left: -((width * 0.075 * textBgScale) / 2),
          top: -((height * 0.35 * textBgScale) / 2),
          width: width * (1 + 0.075 * textBgScale),
          height: height * (1 + 0.35 * textBgScale),
          zIndex: -1,
          borderRadius: 8,
          background: layer.palette?.length > 1 ? `linear-gradient(90deg, ${layer.palette.join(",")})` : layer.palette?.[0] || "rgba(0,0,0,0.3)",
        } : null;

        return (
          <React.Fragment key={layer.id}>
            {overlay && <div style={overlay} />}
            <div
              ref={textRefs.current[layer.id]}
              className={`text-layer ${isSelected ? "selected" : ""} ${hoveredLayer === layer.id ? "hovered" : ""}`}
              style={{
                position: "absolute",
                left,
                top,
                width,
                height,
                zIndex: (layer.zIndex ?? 0) + 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "move",
                touchAction: "none",
              }}
              onPointerDown={(e) => onPointerDownDrag(e, layer)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              onClick={(e) => { e.stopPropagation(); onSelectLayer?.(layer.id); }}
            >
              {textBg && <div style={textBg} />}
              <div
                className={`text-content ${layer.effect} ${hoverEffect === layer.effect ? "hover" : ""}`}
                style={{
                  fontSize: `${layer.fontSize ?? 24}px`,
                  fontFamily: layer.fontFamily || "inherit",
                  fontWeight: layer.fontWeight || 400,
                  textAlign: "center",
                  lineHeight: 1.1,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  color: showTextBg && layer.palette?.length === 1 ? layer.palette[0] : "#fff",
                  background: showTextBg && layer.palette?.length > 1 ? `linear-gradient(90deg, ${layer.palette.join(",")})` : "none",
                  WebkitBackgroundClip: showTextBg && layer.palette?.length > 1 ? "text" : "initial",
                  WebkitTextFillColor: showTextBg && layer.palette?.length > 1 ? "transparent" : "inherit",
                }}
                dangerouslySetInnerHTML={renderTextHtml(layer)}
              />
            </div>
          </React.Fragment>
        );
      })}
    


      <div className="canvas-controls" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>

        <div className="control-group" style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}>
          <h4>Background Settings</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <label>
              Overlay Scale:
              <input type="range" min={0.5} max={10} step={0.5} value={overlayScale} onChange={(e) => setOverlayScale(parseFloat(e.target.value))} />
            </label>
            <label>
              Show Overlay:
              <input type="checkbox" checked={showOverlay} onChange={() => setShowOverlay(p => !p)} />
            </label>
          </div>
        </div>

       
        <div className="control-group" style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}>
          <h4>Text Settings</h4>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <label>
              Text Background Scale:
              <input type="range" min={0.5} max={10} step={0.5} value={textBgScale} onChange={(e) => setTextBgScale(parseFloat(e.target.value))} />
            </label>
            <label>
              Show Text Background:
              <input type="checkbox" checked={showTextBg} onChange={() => setShowTextBg(p => !p)} />
            </label>
          </div>

        
          {selectedLayerObj && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              <label>
                Opacity:
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selectedLayerObj.opacity ?? 1}
                  onChange={(e) => onUpdateLayer(selectedLayerObj.id, "opacity", parseFloat(e.target.value))}
                />
              </label>
              <label>
                Blur:
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.5}
                  value={selectedLayerObj.blur ?? 0}
                  onChange={(e) => onUpdateLayer(selectedLayerObj.id, "blur", parseFloat(e.target.value))}
                />
              </label>
              <label>
                Z-Index:
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={selectedLayerObj.zIndex ?? 0}
                  onChange={(e) => onUpdateLayer(selectedLayerObj.id, "zIndex", parseInt(e.target.value))}
                  style={{ width: 60 }}
                />
              </label>
            </div>
          )}
        </div>

    
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={exportPNG}>Export PNG</button>
          <button className="btn" onClick={saveTemplate}>💾 Save</button>
          <button className="btn" onClick={saveAsNewTemplate}>🆕 Save As New Template</button>
          <label className="btn">
            Upload BG
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleBgUpload} />
          </label>
        </div>
        
      </div>
    </div>
  );
}
*/

        








        






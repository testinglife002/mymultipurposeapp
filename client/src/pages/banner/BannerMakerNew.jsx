// 📄 BannerMakerNew.jsx
// 📄 BannerMakerNew.jsx
import React, { useRef, useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import html2canvas from "html2canvas";
import "./BannerNew.css";
import { useLocation } from "react-router-dom";

export default function BannerMakerNew({ template }) {
  const canvasRef = useRef(null);

  const [canvasScale, setCanvasScale] = useState(1);
  const [bgUrl, setBgUrl] = useState("");

  const [main, setMain] = useState({
    url: "",
    pos: { x: 80, y: 50 },
    size: { w: 400, h: 300 },
    scale: 1,
    rotation: 0,
    flipH: false,
    flipV: false,
    opacity: 1,
    blend: "normal",
  });

  const [layers, setLayers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selected, setSelected] = useState({ id: null, type: null });

  const [textProps, setTextProps] = useState({
    text: "New Text",
    fontSize: 28,
    fontFamily: "Arial",
    fill: "#ffffff",
    background: "rgba(0,0,0,0.4)",
    rotation: 0,
    scale: 1,
  });

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [editingBannerId, setEditingBannerId] = useState(null);
  const location = useLocation();
  const bannerToEdit = location.state?.banner;

  // Function to load banner for editing
  const loadBanner = (banner) => {
    setEditingBannerId(banner._id);
    setBgUrl(banner.backgroundUrl || "");
    setMain(prev => ({ ...prev, url: banner.mainUrl || "" }));
  };

  useEffect(() => {
    if (bannerToEdit) {
      setEditingBannerId(bannerToEdit._id);
      setBgUrl(bannerToEdit.backgroundUrl || "");
      setMain(prev => ({ ...prev, url: bannerToEdit.mainUrl || "" }));
    }
  }, [bannerToEdit]);

  useEffect(() => {
    if (template) {
      setBgUrl(template.bgImageUrl || "");
      setLayers(template.layers?.filter(l => l.type === "background") || []);
      setTexts(template.layers?.filter(l => l.type === "text") || []);
    }
  }, [template]);


  // ---------- History ----------
  const snapshot = () => ({ bgUrl, main, layers, texts });
  const pushHistory = (label) => {
    const snap = snapshot();
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push({ label, snap: JSON.parse(JSON.stringify(snap)) });
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };
  const restoreSnapshot = (snap) => {
    setBgUrl(snap.bgUrl || "");
    setMain(snap.main || {});
    setLayers(snap.layers || []);
    setTexts(snap.texts || []);
    setSelected({ id: null, type: null });
  };
  const undo = () => {
    if (historyIndex > 0) {
      restoreSnapshot(history[historyIndex - 1].snap);
      setHistoryIndex(historyIndex - 1);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      restoreSnapshot(history[historyIndex + 1].snap);
      setHistoryIndex(historyIndex + 1);
    }
  };
  useEffect(() => pushHistory("init"), []);

  // ---------- Pointer Transform Hook ----------
  const usePointerTransform = (setTarget, type) => {
    const stateRef = useRef({ dragging: false, resizing: false, rotating: false, start: null, currentObj: null, corner: null });

    const onPointerDown = (e, obj, action = "drag", corner = null) => {
      e.stopPropagation();
      setSelected({ id: obj.id, type });
      stateRef.current = {
        dragging: action === "drag",
        resizing: action === "resize",
        rotating: action === "rotate",
        start: { x: e.clientX, y: e.clientY, pos: obj.pos || { x: 0, y: 0 }, size: obj.size || null, rotation: obj.rotation || 0, scale: obj.scale || 1 },
        currentObj: obj,
        corner,
      };
    };

    useEffect(() => {
      const onMove = (e) => {
        const s = stateRef.current;
        if (!s.start || !s.currentObj) return;

        const updateItem = (item) => {
          const newItem = { ...item };

          // Drag
          if (s.dragging && newItem.pos) {
            newItem.pos = {
              x: s.start.pos.x + (e.clientX - s.start.x) / canvasScale,
              y: s.start.pos.y + (e.clientY - s.start.y) / canvasScale,
            };
          }

          // Resize
          if (s.resizing && newItem.size) {
            let dx = (e.clientX - s.start.x) / canvasScale;
            let dy = (e.clientY - s.start.y) / canvasScale;
            let { w, h, x, y } = s.start.size;
            switch (s.corner) {
              case "br": w += dx; h += dy; break;
              case "bl": w -= dx; h += dy; x += dx; break;
              case "tr": w += dx; h -= dy; y += dy; break;
              case "tl": w -= dx; h -= dy; x += dx; y += dy; break;
            }
            newItem.size = { w: Math.max(20, w), h: Math.max(20, h) };
            newItem.pos = { x, y };
          }

          // Rotate
          if (s.rotating) {
            const cx = (newItem.pos?.x || 0) + ((newItem.size?.w || 0) / 2);
            const cy = (newItem.pos?.y || 0) + ((newItem.size?.h || 0) / 2);
            newItem.rotation = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
          }

          return newItem;
        };

        setTarget(prev =>
          Array.isArray(prev)
            ? prev.map(item => item.id === s.currentObj.id ? updateItem(item) : item)
            : updateItem(prev)
        );
      };

      const onUp = () => {
        if (stateRef.current.dragging || stateRef.current.resizing || stateRef.current.rotating)
          pushHistory("transform");
        stateRef.current = { dragging: false, resizing: false, rotating: false, start: null, currentObj: null, corner: null };
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
    }, [setTarget]);

    return onPointerDown;
  };

  const mainPointerDown = usePointerTransform(setMain, "main");
  const layersPointerDown = usePointerTransform(setLayers, "layer");
  const textsPointerDown = usePointerTransform(setTexts, "text");

  // ---------- Add Text / Layer ----------
  const addText = () => {
    const id = `text-${Date.now()}`;
    setTexts(prev => [...prev, { id, ...textProps, pos: { x: 60, y: 60 }, size: { w: 150, h: 50 } }]);
    setSelected({ id, type: "text" });
    pushHistory("add-text");
  };

  const addLayer = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    let url;
    try {
      url = (await newRequest.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } })).data.secure_url;
    } catch {
      url = URL.createObjectURL(file);
    }
    const layer = { id: Date.now().toString(), url, pos: { x: 50, y: 50 }, size: { w: 300, h: 200 }, scale: 1, rotation: 0, opacity: 1, blendMode: "normal", flipH: false, flipV: false };
    setLayers(prev => [...prev, layer]);
    pushHistory("add-layer");
  };

  const removeSelected = () => {
    if (!selected.type) return;
    if (selected.type === "main") setMain(prev => ({ ...prev, url: "" }));
    if (selected.type === "layer") setLayers(prev => prev.filter(l => l.id !== selected.id));
    if (selected.type === "text") setTexts(prev => prev.filter(t => t.id !== selected.id));
    if (selected.type === "bg") setBgUrl("");
    setSelected({ id: null, type: null });
    pushHistory("remove-selected");
  };

  // ---------- Render Handles ----------
  const renderHandles = (obj, onPointerDownFn, type) => {
    if (!selected.id || selected.id !== obj.id) return null;

    const size = obj.size;
    const scale = obj.scale || 1;

    return (
      <>
        {size && ["tl", "tr", "bl", "br"].map(c => (
          <div
            key={c}
            className="handle resize-handle"
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              background: "white",
              border: "1px solid black",
              cursor: `${c}-resize`,
              left: (c.includes("l") ? -6 : size.w * scale - 6),
              top: (c.includes("t") ? -6 : size.h * scale - 6),
              zIndex: 100,
              transform: `scale(${canvasScale})`,
              transformOrigin: "top left"
            }}
            onPointerDown={(e) => onPointerDownFn(e, obj, "resize", c)}
          />
        ))}
        <div
          className="handle rotate-handle"
          style={{
            position: "absolute",
            width: 14,
            height: 14,
            background: "yellow",
            border: "1px solid black",
            borderRadius: "50%",
            left: size ? size.w * scale / 2 - 7 : 0,
            top: -30,
            cursor: "grab",
            zIndex: 100,
            transform: `scale(${canvasScale})`,
            transformOrigin: "top left"
          }}
          onPointerDown={(e) => onPointerDownFn(e, obj, "rotate")}
        />
      </>
    );
  };

  // ---------- Export / Save / Load ----------
  const saveTemplate = async () => { 
    localStorage.setItem("bannerTemplate", JSON.stringify(snapshot())); 
    try {
        const templateData = {
            name: `Template ${Date.now()}`,
            bgImageUrl: bg.url || "",
            mainImageUrl: main.url || "",
            layers: layers.map((l) => ({ ...l })),
            texts: texts.map((t) => ({ ...t })),
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(templateData));

        // Optionally, upload bg image file if available
        const res = await newRequest.post("/text-templates", formData);
        alert("Template saved successfully!");
        console.log("Saved template:", res.data);
    } catch (err) {
        console.error(err);
        alert("Failed to save template.");
    }
    alert("Template saved!"); 
  };

  const loadTemplate = () => { const tpl = localStorage.getItem("bannerTemplate"); if(tpl) restoreSnapshot(JSON.parse(tpl)); };
  
  /*
  const exportBanner = async () => {
    if(!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "banner.png";
    link.click();
  };
  */


  const exportBanner = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current);
      const dataUrl = canvas.toDataURL("image/png");

      let res;
      if (editingBannerId) {
        // Update existing banner
        res = await newRequest.put(`/banner/${editingBannerId}`, {
          dataUrl,
          backgroundUrl: bgUrl || "",
          mainUrl: main.url || "",
        });
        alert("✅ Banner updated successfully!");
        setEditingBannerId(null);
      } else {
        // Create new banner
        res = await newRequest.post("/banner/export", {
          dataUrl,
          backgroundUrl: bgUrl || "",
          mainUrl: main.url || "",
        });
        alert("✅ Banner saved successfully!");
      }
      console.log("Banner saved:", res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save banner");
    }
  };


 const downloadBanner = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "banner.png";
    link.click();
  };



  return (
    <div className="banner-main-container">
      
      <div className="toolbar" style={{ display: "flex", gap: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
        <button onClick={undo}  ><span style={{color:'black'}} >Undo</span></button>
        <button onClick={redo}><span style={{color:'black'}} >Redo</span></button>
        <button onClick={removeSelected}><span style={{color:'black'}} >Delete Selected</span></button>
        <button onClick={saveTemplate}><span style={{color:'black'}} >Save Template</span></button>
        <button onClick={loadTemplate}><span style={{color:'black'}} >Load Template</span></button>
        <button onClick={exportBanner}><span style={{color:'black'}}>Save Banner</span></button>
        <button onClick={downloadBanner}><span style={{color:'black'}}>Export PNG</span></button>
      </div>

      <div className="left-controls">
        <h3>Controls</h3>
        <input type="file" onChange={e=>setBgUrl(URL.createObjectURL(e.target.files[0]))}/>
        <input type="file" onChange={e=>setMain(prev=>({...prev,url:URL.createObjectURL(e.target.files[0])}))}/>
        <input type="file" onChange={e=>addLayer(e.target.files[0])}/>
        <label>
          Canvas Scale: 
          <input type="range" min="0.2" max="3" step="0.01" value={canvasScale} onChange={e=>setCanvasScale(parseFloat(e.target.value))}/>
        </label>

        <div >
          <h3>Text Controls</h3>
          <input placeholder="Text" value={textProps.text} onChange={e=>setTextProps({...textProps,text:e.target.value})}/>
          <input type="number" value={textProps.fontSize} onChange={e=>setTextProps({...textProps,fontSize:parseInt(e.target.value||28)})} style={{width:70}}/>
          <input type="color" value={textProps.fill} onChange={e=>setTextProps({...textProps,fill:e.target.value})}/>
          <input type="color" value={textProps.background} onChange={e=>setTextProps({...textProps,background:e.target.value})}/>
          <label>Scale: <input type="range" min="0.2" max="3" step="0.01" value={textProps.scale} onChange={e=>setTextProps({...textProps,scale:parseFloat(e.target.value)})}/></label>
          <button onClick={addText}>Add Text</button>
        </div>
      </div>


      {/* ---------- Combined Canvas Wrapper for Export ---------- */}
      {/* ---------- Canvas Wrapper ---------- */}
      {/* ---------- Canvas ---------- */}
      <div className="canvas-wrapper-center">
        <div ref={canvasRef} style={{ width: 900, height: 400, transform: `scale(${canvasScale})`, transformOrigin: "top left", position: "relative" }}>
          {bgUrl && <img src={bgUrl} alt="bg" style={{ position: "absolute", width: "100%", height: "100%" }} />}
          
          {main.url && (
            <div
              style={{ position: "absolute", left: main.pos.x, top: main.pos.y, width: main.size.w * main.scale, height: main.size.h * main.scale, transform: `rotate(${main.rotation}deg)`, transformOrigin: "center center" }}
              onPointerDown={e => mainPointerDown(e, main)}
            >
              <img src={main.url} alt="main" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: main.blend, opacity: main.opacity, transform: `scale(${main.flipH ? -1 : 1},${main.flipV ? -1 : 1})` }} />
              {renderHandles(main, mainPointerDown, "main")}
            </div>
          )}

          {layers.map(layer => (
            <div
              key={layer.id}
              style={{ position: "absolute", left: layer.pos.x, top: layer.pos.y, width: layer.size.w * layer.scale, height: layer.size.h * layer.scale, transform: `rotate(${layer.rotation}deg)`, transformOrigin: "center center" }}
              onPointerDown={e => layersPointerDown(e, layer)}
            >
              <img src={layer.url} alt="layer" draggable={false} style={{ width: "100%", height: "100%", mixBlendMode: layer.blendMode, opacity: layer.opacity }} />
              {renderHandles(layer, layersPointerDown, "layer")}
            </div>
          ))}

          {texts.map(text => (
            <div
              key={text.id}
              style={{ position: "absolute", left: text.pos.x, top: text.pos.y, width: text.size?.w, height: text.size?.h, transform: `rotate(${text.rotation}deg) scale(${text.scale})`, cursor: "grab", userSelect: "none" }}
              onPointerDown={e => textsPointerDown(e, text)}
            >
              <div style={{ fontSize: text.fontSize, fontFamily: text.fontFamily, color: text.fill, background: text.background, padding: 4, width: "100%", height: "100%" }}>
                {text.text}
              </div>
              {renderHandles(text, textsPointerDown, "text")}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}




// BannerMakerNew.jsx
// 📄 BannerMakerNew.jsx (Step 1)
/*
import React, { useRef, useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import { ChromePicker } from "react-color"; // 🎨 new import
import "./BannerMakerNew.css";

const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

const PREVIEW_BLEND = ["normal", "multiply", "overlay", "screen", "darken"];

export default function BannerMakerNew() {
  // Background & Main
  const [bgUrl, setBgUrl] = useState("");
  const [bgScale, setBgScale] = useState(1);
  const [mainUrl, setMainUrl] = useState("");
  const [mainPos, setMainPos] = useState({ x: 100, y: 50 });
  const [mainSize, setMainSize] = useState({ w: 400, h: 300 });
  const [mainScale, setMainScale] = useState(1);
  const [mainRotation, setMainRotation] = useState(0);
  const [mainFlipH, setMainFlipH] = useState(false);
  const [mainFlipV, setMainFlipV] = useState(false);
  const [mainOpacity, setMainOpacity] = useState(1);
  const [mainBlend, setMainBlend] = useState("normal");
  const [mainFilter, setMainFilter] = useState({
    blur: 0,
    saturate: 1,
    contrast: 1,
    brightness: 1,
    grayscale: 0,
  });

  // layers and texts
  const [layers, setLayers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // text props UI (extended)
  const [textProps, setTextProps] = useState({
    text: "New Text",
    fontSize: 28,
    fontFamily: "Arial",
    fill: "#ffffff",
    align: "left",
    background: "rgba(0,0,0,0.4)",
    shadowColor: "#000000",
    shadowBlur: 2,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    stroke: "#000000",
    strokeWidth: 0,
    rotation: 0,
    scale: 1,
  });

  // 🎨 For ChromePicker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(textProps.fill);

  // history for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef(null);
  const mainRef = useRef(null);

  const [selectedPreviewBlend, setSelectedPreviewBlend] = useState(null);

  // Pointer states — now includes rotation/resizing for text
  const layerStateRef = useRef({ dragging: false, resizing: false, rotating: false, start: null });
  const mainStateRef = useRef({ dragging: false, resizing: false, rotating: false, start: null });
  const textStateRef = useRef({ dragging: false, resizing: false, rotating: false, start: null }); // 🆕 extended

  // ✅ Color change handler for ChromePicker
  const handleColorChange = (color) => {
    setColor(color.hex);
    setTextProps((prev) => ({ ...prev, fill: color.hex }));

    // update selected text live
    if (selectedType === "text" && selectedId) {
      setTexts((prev) =>
        prev.map((t) => (t.id === selectedId ? { ...t, fill: color.hex } : t))
      );
    }
  };

  // ✅ Toggle color picker visibility
  const toggleColorPicker = () => setShowColorPicker((prev) => !prev);

  // ... (everything else remains the same for now)

  // Generic snapshot of editor state (include scales)
  const snapshot = () => ({
    bgUrl,
    bgScale,
    mainUrl,
    mainPos,
    mainSize,
    mainScale,
    mainRotation,
    mainFlipH,
    mainFlipV,
    mainOpacity,
    mainBlend,
    mainFilter,
    layers,
    texts,
  });

  const pushHistory = (label) => {
    const snap = snapshot();
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(JSON.parse(JSON.stringify({ time: Date.now(), label, snap })));
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  useEffect(() => {
    // push initial state at mount
    pushHistory("init");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1].snap;
      restoreSnapshot(prev);
      setHistoryIndex(historyIndex - 1);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1].snap;
      restoreSnapshot(next);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const restoreSnapshot = (s) => {
    setBgUrl(s.bgUrl || "");
    setBgScale(s.bgScale ?? 1);
    setMainUrl(s.mainUrl || "");
    setMainPos(s.mainPos || { x: 100, y: 50 });
    setMainSize(s.mainSize || { w: 400, h: 300 });
    setMainScale(s.mainScale ?? 1);
    setMainRotation(s.mainRotation || 0);
    setMainFlipH(s.mainFlipH || false);
    setMainFlipV(s.mainFlipV || false);
    setMainOpacity(s.mainOpacity ?? 1);
    setMainBlend(s.mainBlend || "normal");
    setMainFilter(
      s.mainFilter || { blur: 0, saturate: 1, contrast: 1, brightness: 1, grayscale: 0 }
    );
    setLayers(s.layers || []);
    setTexts(s.texts || []);
    setSelectedId(null);
    setSelectedType(null);
  };

  // Upload helper (keeps user's original function signature)
  const uploadToServer = async (file) => {
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await newRequest.post("/uploads", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.secure_url;
    } catch (err) {
      return URL.createObjectURL(file);
    }
  };

  // ---------- File / Background handlers ----------
  const handleBgChoose = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBgUrl(URL.createObjectURL(f));
    setBgScale(1);
    pushHistory("set-background");
  };
  const handleMainChoose = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setMainUrl(URL.createObjectURL(f));
    setMainPos({ x: 80, y: 50 });
    setMainSize({ w: 400, h: 300 });
    setMainScale(1);
    setMainRotation(0);
    pushHistory("set-main");
  };

  // add layer (uploads then creates layer) — includes scale
  const addLayer = async (file, type = "layer") => {
    if (!file) return;
    const url = await uploadToServer(file);
    const newLayer = {
      id: Date.now().toString(),
      type,
      url,
      pos: { x: 50, y: 50 },
      size: { w: type === "background" ? 900 : 300, h: type === "background" ? 400 : 200 },
      scale: 1,
      rotation: 0,
      opacity: 1,
      blendMode: "normal",
      filter: { blur: 0, saturate: 1, contrast: 1 },
      flipH: false,
      flipV: false,
      zIndex: layers.length + 1,
    };
    const updated = [...layers, newLayer];
    setLayers(updated);
    pushHistory("add-layer");
  };

  // ---------- Layer drag / resize / rotate (DOM-based) ----------
  const onLayerPointerDown = (e, layer) => {
    e.stopPropagation();
    setSelectedId(layer.id);
    setSelectedType("layer");
    layerStateRef.current = {
      dragging: true,
      start: { x: e.clientX, y: e.clientY, sx: layer.pos.x, sy: layer.pos.y, id: layer.id },
    };
  };
  const onLayerResizePointerDown = (e, layer, corner) => {
    e.stopPropagation();
    setSelectedId(layer.id);
    setSelectedType("layer");
    layerStateRef.current = {
      resizing: true,
      corner,
      start: { x: e.clientX, y: e.clientY, w: layer.size.w, h: layer.size.h, sx: layer.pos.x, sy: layer.pos.y, id: layer.id },
    };
  };
  const onLayerRotatePointerDown = (e, layer) => {
    e.stopPropagation();
    setSelectedId(layer.id);
    setSelectedType("layer");
    layerStateRef.current = {
      rotating: true,
      start: { x: e.clientX, y: e.clientY, center: { x: layer.pos.x + layer.size.w / 2, y: layer.pos.y + layer.size.h / 2 }, id: layer.id },
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const s = layerStateRef.current;
      if (!s) return;
      if (s.dragging) {
        setLayers((prev) =>
          prev.map((l) => {
            if (l.id !== s.start.id) return l;
            const dx = e.clientX - s.start.x;
            const dy = e.clientY - s.start.y;
            return { ...l, pos: { x: s.start.sx + dx, y: s.start.sy + dy } };
          })
        );
      }
      if (s.resizing) {
        setLayers((prev) =>
          prev.map((l) => {
            if (l.id !== s.start.id) return l;
            const dx = e.clientX - s.start.x;
            const dy = e.clientY - s.start.y;
            let newW = s.start.w;
            let newH = s.start.h;
            let newX = s.start.sx;
            let newY = s.start.sy;
            switch (s.corner) {
              case "br":
                newW = Math.max(20, s.start.w + dx);
                newH = Math.max(20, s.start.h + dy);
                break;
              case "bl":
                newW = Math.max(20, s.start.w - dx);
                newH = Math.max(20, s.start.h + dy);
                newX = s.start.sx + dx;
                break;
              case "tr":
                newW = Math.max(20, s.start.w + dx);
                newH = Math.max(20, s.start.h - dy);
                newY = s.start.sy + dy;
                break;
              case "tl":
                newW = Math.max(20, s.start.w - dx);
                newH = Math.max(20, s.start.h - dy);
                newX = s.start.sx + dx;
                newY = s.start.sy + dy;
                break;
              default:
                break;
            }
            return { ...l, size: { w: newW, h: newH }, pos: { x: newX, y: newY } };
          })
        );
      }
      if (s.rotating) {
        setLayers((prev) =>
          prev.map((l) => {
            if (l.id !== s.start.id) return l;
            const cx = s.start.center.x;
            const cy = s.start.center.y;
            const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
            return { ...l, rotation: angle };
          })
        );
      }
    };
    const onUp = (e) => {
      const s = layerStateRef.current;
      if (s && (s.dragging || s.resizing || s.rotating)) pushHistory("layer-transform");
      layerStateRef.current = { dragging: false, resizing: false, rotating: false, start: null };
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [layers, historyIndex]);

  // ---------- Main image DOM drag/resize/rotate handlers ----------
  const onMainPointerDown = (e) => {
    e.preventDefault();
    setSelectedId("main");
    setSelectedType("main");
    mainStateRef.current = { dragging: true, start: { x: e.clientX, y: e.clientY, sx: mainPos.x, sy: mainPos.y } };
  };
  const onMainResizePointerDown = (e, corner) => {
    e.stopPropagation();
    setSelectedId("main");
    setSelectedType("main");
    mainStateRef.current = {
      resizing: true,
      corner,
      start: { x: e.clientX, y: e.clientY, w: mainSize.w, h: mainSize.h, sx: mainPos.x, sy: mainPos.y },
    };
  };
  const onMainRotatePointerDown = (e) => {
    e.stopPropagation();
    setSelectedId("main");
    setSelectedType("main");
    mainStateRef.current = {
      rotating: true,
      start: { x: e.clientX, y: e.clientY, center: { x: mainPos.x + mainSize.w / 2, y: mainPos.y + mainSize.h / 2 } },
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const s = mainStateRef.current;
      if (!s) return;
      if (s.dragging) {
        const dx = e.clientX - s.start.x;
        const dy = e.clientY - s.start.y;
        setMainPos({ x: s.start.sx + dx, y: s.start.sy + dy });
      }
      if (s.resizing) {
        const dx = e.clientX - s.start.x;
        const dy = e.clientY - s.start.y;
        let newW = s.start.w;
        let newH = s.start.h;
        let newX = s.start.sx;
        let newY = s.start.sy;
        switch (s.corner) {
          case "br":
            newW = Math.max(20, s.start.w + dx);
            newH = Math.max(20, s.start.h + dy);
            break;
          case "bl":
            newW = Math.max(20, s.start.w - dx);
            newH = Math.max(20, s.start.h + dy);
            newX = s.start.sx + dx;
            break;
          case "tr":
            newW = Math.max(20, s.start.w + dx);
            newH = Math.max(20, s.start.h - dy);
            newY = s.start.sy + dy;
            break;
          case "tl":
            newW = Math.max(20, s.start.w - dx);
            newH = Math.max(20, s.start.h - dy);
            newX = s.start.sx + dx;
            newY = s.start.sy + dy;
            break;
          default:
            break;
        }
        setMainSize({ w: newW, h: newH });
        setMainPos({ x: newX, y: newY });
      }
      if (s.rotating) {
        const cx = s.start.center.x;
        const cy = s.start.center.y;
        const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
        setMainRotation(angle);
      }
    };
    const onUp = (e) => {
      const s = mainStateRef.current;
      if (s && (s.dragging || s.resizing || s.rotating)) pushHistory("main-transform");
      mainStateRef.current = { dragging: false, resizing: false, rotating: false, start: null };
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [mainPos, mainSize, mainRotation, mainScale]);

  // ------------------------------
  // ✨ Canvas rendering & handlers
  // ------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bg = new Image();
    const main = new Image();

    const drawAll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (bgUrl) {
        ctx.save();
        ctx.scale(bgScale, bgScale);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Draw layers
      layers.forEach((layer) => {
        const img = new Image();
        img.src = layer.url;
        ctx.save();
        ctx.globalAlpha = layer.opacity ?? 1;
        ctx.globalCompositeOperation = layer.blend ?? "normal";
        ctx.translate(layer.x + layer.w / 2, layer.y + layer.h / 2);
        ctx.rotate((layer.rotation ?? 0) * Math.PI / 180);
        ctx.scale(layer.flipH ? -1 : 1, layer.flipV ? -1 : 1);
        ctx.drawImage(img, -layer.w / 2, -layer.h / 2, layer.w, layer.h);
        ctx.restore();
      });

      // Draw main
      if (mainUrl) {
        ctx.save();
        ctx.globalAlpha = mainOpacity;
        ctx.globalCompositeOperation = mainBlend;
        ctx.translate(mainPos.x + mainSize.w / 2, mainPos.y + mainSize.h / 2);
        ctx.rotate((mainRotation * Math.PI) / 180);
        ctx.scale(mainFlipH ? -mainScale : mainScale, mainFlipV ? -mainScale : mainScale);
        ctx.filter = `
          blur(${mainFilter.blur}px)
          saturate(${mainFilter.saturate})
          contrast(${mainFilter.contrast})
          brightness(${mainFilter.brightness})
          grayscale(${mainFilter.grayscale})
        `;
        ctx.drawImage(main, -mainSize.w / 2, -mainSize.h / 2, mainSize.w, mainSize.h);
        ctx.restore();
      }

      // Draw texts
      texts.forEach((txt) => {
        ctx.save();
        ctx.translate(txt.x, txt.y);
        ctx.rotate((txt.rotation ?? 0) * Math.PI / 180);
        ctx.scale(txt.scale ?? 1, txt.scale ?? 1);
        ctx.font = `${txt.fontSize}px ${txt.fontFamily}`;
        ctx.fillStyle = txt.fill;
        ctx.textAlign = txt.align;
        ctx.shadowColor = txt.shadowColor;
        ctx.shadowBlur = txt.shadowBlur;
        ctx.shadowOffsetX = txt.shadowOffsetX;
        ctx.shadowOffsetY = txt.shadowOffsetY;
        ctx.lineWidth = txt.strokeWidth;
        if (txt.strokeWidth > 0) ctx.strokeText(txt.text, 0, 0);
        ctx.fillText(txt.text, 0, 0);
        ctx.restore();

        // Draw selection outline for active text
        if (selectedType === "text" && selectedId === txt.id) {
          ctx.save();
          ctx.strokeStyle = "cyan";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(txt.x - 60, txt.y - txt.fontSize, txt.text.length * (txt.fontSize / 1.8), txt.fontSize * 1.3);
          ctx.restore();
        }
      });
    };

    bg.onload = drawAll;
    main.onload = drawAll;
    drawAll();
  }, [
    bgUrl, bgScale,
    mainUrl, mainPos, mainSize, mainScale, mainRotation,
    mainFlipH, mainFlipV, mainOpacity, mainBlend, mainFilter,
    layers, texts, selectedId, selectedType
  ]);

  // ------------------------------
  // ✋ Pointer Handlers (Text)
  // ------------------------------
  const handleTextMouseDown = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    setSelectedType("text");
    const text = texts.find((t) => t.id === id);
    textStateRef.current.dragging = true;
    textStateRef.current.start = { x: e.clientX, y: e.clientY, ...text };
  };

  const handleMouseMove = (e) => {
    if (textStateRef.current.dragging && selectedType === "text" && selectedId) {
      const dx = e.clientX - textStateRef.current.start.x;
      const dy = e.clientY - textStateRef.current.start.y;

      setTexts((prev) =>
        prev.map((t) =>
          t.id === selectedId ? { ...t, x: textStateRef.current.start.x + dx, y: textStateRef.current.start.y + dy } : t
        )
      );
    }
  };

  const handleMouseUp = () => {
    textStateRef.current.dragging = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedId, selectedType]);

  // ------------------------------
  // 🧰 Inline Text Tools UI
  // ------------------------------
  const updateTextProp = (key, value) => {
    setTextProps((prev) => ({ ...prev, [key]: value }));
    if (selectedType === "text" && selectedId) {
      setTexts((prev) =>
        prev.map((t) => (t.id === selectedId ? { ...t, [key]: value } : t))
      );
    }
  };

  // ---------- Text handling (add / drag / edit) ----------
  const addText = () => {
    const id = `text-${Date.now()}`;
    const t = {
      id,
      text: textProps.text || "New Text",
      x: 60,
      y: 60,
      fontSize: textProps.fontSize,
      fontFamily: textProps.fontFamily,
      fill: textProps.fill,
      background: textProps.background,
      rotation: textProps.rotation || 0,
      padding: 6,
      scale: textProps.scale ?? 1,
    };
    setTexts((prev) => [...prev, t]);
    setSelectedId(id);
    setSelectedType("text");
    pushHistory("add-text");
  };

  const onTextPointerDown = (e, t) => {
    e.stopPropagation();
    setSelectedId(t.id);
    setSelectedType("text");
    textStateRef.current = { dragging: true, start: { x: e.clientX, y: e.clientY, sx: t.x, sy: t.y, id: t.id } };
  };

  useEffect(() => {
    // handle dragging for texts
    const onMove = (e) => {
      const s = textStateRef.current;
      if (!s || !s.dragging) return;
      setTexts((prev) =>
        prev.map((tx) => {
          if (tx.id !== s.start.id) return tx;
          const dx = e.clientX - s.start.x;
          const dy = e.clientY - s.start.y;
          return { ...tx, x: s.start.sx + dx, y: s.start.sy + dy };
        })
      );
    };
    const onUp = () => {
      const s = textStateRef.current;
      if (s && s.dragging) pushHistory("text-transform");
      textStateRef.current = { dragging: false, start: null };
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [texts, historyIndex]);

  const applyEdit = () => {
    setTexts((prev) => prev.map((t) => (t.id === editTarget ? { ...t, text: editText } : t)));
    setIsEditing(false);
    setEditTarget(null);
    setEditText("");
    pushHistory("edit-text");
  };

  const handleTextPropChange = (prop, value) => {
    setTextProps((prev) => ({ ...prev, [prop]: value }));
    if (selectedType === "text" && selectedId) {
      setTexts((prev) => prev.map((t) => (t.id === selectedId ? { ...t, [prop]: value } : t)));
    }
  };

  const handleDblClickText = (t) => {
    setEditText(t.text);
    setEditTarget(t.id);
    setIsEditing(true);
  };

  // ---------- Export (canvas draw) ----------
  const exportCanvas = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    if (bgUrl) {
      const bg = new Image();
      bg.crossOrigin = "anonymous";
      bg.src = bgUrl;
      await new Promise((r) => (bg.onload = r));
      ctx.save();
      // center scale for bg
      const bgW = canvas.width * bgScale;
      const bgH = canvas.height * bgScale;
      const offsetX = (canvas.width - bgW) / 2;
      const offsetY = (canvas.height - bgH) / 2;
      ctx.drawImage(bg, offsetX, offsetY, bgW, bgH);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // main
    if (mainUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = mainUrl;
      await new Promise((r) => (img.onload = r));
      ctx.save();
      ctx.globalAlpha = mainOpacity;
      try {
        ctx.globalCompositeOperation = mainBlend;
      } catch (e) {
        ctx.globalCompositeOperation = "source-over";
      }
      const drawW = mainSize.w * mainScale;
      const drawH = mainSize.h * mainScale;
      ctx.translate(mainPos.x + drawW / 2, mainPos.y + drawH / 2);
      ctx.rotate((mainRotation * Math.PI) / 180);
      ctx.scale(mainFlipH ? -1 : 1, mainFlipV ? -1 : 1);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // layers
    for (const l of layers) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = l.url;
      await new Promise((r) => (img.onload = r));
      ctx.save();
      ctx.globalAlpha = l.opacity ?? 1;
      try {
        ctx.globalCompositeOperation = l.blendMode || "source-over";
      } catch (e) {
        ctx.globalCompositeOperation = "source-over";
      }
      const drawW = (l.size.w || 100) * (l.scale ?? 1);
      const drawH = (l.size.h || 100) * (l.scale ?? 1);
      ctx.translate(l.pos.x + drawW / 2, l.pos.y + drawH / 2);
      ctx.rotate(((l.rotation || 0) * Math.PI) / 180);
      ctx.scale(l.flipH ? -1 : 1, l.flipV ? -1 : 1);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // texts
    for (const t of texts) {
      ctx.save();
      const fontSize = (t.fontSize || 28) * (t.scale || 1);
      ctx.font = `${fontSize}px ${t.fontFamily || "Arial"}`;
      ctx.fillStyle = t.fill || "#fff";
      ctx.translate(t.x, t.y);
      ctx.rotate(((t.rotation || 0) * Math.PI) / 180);
      // background
      if (t.background) {
        const w = ctx.measureText(t.text).width + 12;
        const h = (t.fontSize || 28) + 8;
        ctx.fillStyle = t.background;
        ctx.fillRect(-6, -h + 6, w, h);
        ctx.fillStyle = t.fill || "#fff";
      }
      ctx.fillText(t.text, 0, 0);
      ctx.restore();
    }

    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  };

  const handleExportToServer = async () => {
    const dataUrl = await exportCanvas();
    const res = await newRequest.post("/banner/export", { dataUrl });
    alert("Saved: " + (res.data?.cloudUrl || "server-ok"));
  };

  // ---------- UI small helpers ----------
  const formatFilterString = (f) =>
    `blur(${f.blur}px) saturate(${f.saturate}) contrast(${f.contrast}) brightness(${f.brightness}) grayscale(${f.grayscale})`;

  // update layer property
  const updateLayer = (id, patch, push = true) => {
    setLayers((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...patch } : l));
      if (push) pushHistory("layer-update");
      return next;
    });
  };

  // update text property
  const updateText = (id, patch, push = true) => {
    setTexts((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
      if (push) pushHistory("text-update");
      return next;
    });
  };

  // remove selected
  const removeSelected = () => {
    if (selectedType === "layer") {
      setLayers((prev) => {
        const next = prev.filter((l) => l.id !== selectedId);
        pushHistory("del-layer");
        return next;
      });
    }
    if (selectedType === "text") {
      setTexts((prev) => {
        const next = prev.filter((t) => t.id !== selectedId);
        pushHistory("del-text");
        return next;
      });
    }
    if (selectedType === "main") {
      setMainUrl("");
      pushHistory("del-main");
    }
    if (selectedType === "bg") {
      setBgUrl("");
      pushHistory("del-bg");
    }
    setSelectedId(null);
    setSelectedType(null);
  };

  // Add sticker quick handler
  const handleSticker = (src) => {
    const id = `layer-${Date.now()}`;
    const l = {
      id,
      url: src,
      pos: { x: 120, y: 80 },
      size: { w: 120, h: 120 },
      scale: 1,
      rotation: 0,
      opacity: 1,
      blendMode: "normal",
      flipH: false,
      flipV: false,
    };
    setLayers((prev) => {
      const next = [...prev, l];
      pushHistory("add-sticker");
      return next;
    });
  };

  // Load sample template (adds texts and layers & scales)
  const handleTemplate = () => {
    setTexts([
      {
        id: "title",
        text: "🚀 Launch Your Product",
        x: 40,
        y: 300,
        fontSize: 32,
        fill: "white",
        background: "rgba(0,0,0,0.5)",
        padding: 8,
        fontFamily: "Arial",
        scale: 1,
      },
    ]);
    setLayers([
      {
        id: "emoji-rocket",
        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
        pos: { x: 250, y: 100 },
        size: { w: 72, h: 72 },
        scale: 1,
        opacity: 1,
        rotation: 0,
        blendMode: "normal",
      },
    ]);
    pushHistory("template-load");
  };

  // when clicking a preview, set mainBlend and show preview overlay
  const handlePreviewClick = (b) => {
    setMainBlend(b);
    setSelectedPreviewBlend(b);
    pushHistory("preview-blend");
    // hide overlay after short timeout? keep visible until changed
  };

  // compute currently selected object for controls
  const getSelectedObject = () => {
    if (selectedType === "main") {
      return {
        id: "main",
        type: "main",
        scale: mainScale,
        setScale: (s) => {
          setMainScale(s);
          pushHistory("main-scale");
        },
      };
    }
    if (selectedType === "bg") {
      return {
        id: "bg",
        type: "bg",
        scale: bgScale,
        setScale: (s) => {
          setBgScale(s);
          pushHistory("bg-scale");
        },
      };
    }
    if (selectedType === "layer") {
      const layer = layers.find((l) => l.id === selectedId);
      if (!layer) return null;
      return {
        ...layer,
        setScale: (s) => updateLayer(layer.id, { scale: s }),
      };
    }
    if (selectedType === "text") {
      const t = texts.find((x) => x.id === selectedId);
      if (!t) return null;
      return {
        ...t,
        setScale: (s) => updateText(t.id, { scale: s }),
      };
    }
    return null;
  };

  const selectedObject = getSelectedObject();

  return (
    <div className="banner-container">
      <div className="banner-section">
        <h2>Banner Creator — Mini Photoshop</h2>

        <div className="controls">
          <div className="row">
            <label>Background:</label>
            <input type="file" onChange={handleBgChoose} />
            <button onClick={() => { setSelectedType("bg"); setSelectedId("bg"); }}>Select BG</button>
          </div>

          <div className="row">
            <label>Main Image:</label>
            <input type="file" onChange={handleMainChoose} />
            <label style={{ marginLeft: 10 }}>Or add layer:</label>
            <input type="file" onChange={(e) => addLayer(e.target.files[0], "layer")} />
          </div>

          <div className="row">
            <div className="btn-row">
              <button
                onClick={() => {
                  pushHistory("manual-save");
                  alert("Snapshot saved");
                }}
              >
                Snapshot
              </button>
              <button onClick={undo}>Undo</button>
              <button onClick={redo}>Redo</button>
              <button onClick={removeSelected}>Delete</button>
            </div>
          </div>

          
          <div className="blend-previews">
            <label>Blend previews</label>
            <div className="preview-grid">
              {PREVIEW_BLEND.map((b) => (
                <div
                  key={b}
                  className={`preview-item ${selectedPreviewBlend === b ? "selected" : ""}`}
                  onClick={() => handlePreviewClick(b)}
                  title={b}
                >
                  <div className="thumb" style={{ mixBlendMode: b }}>
                    <img
                      src={
                        mainUrl ||
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23ff7a18"/></svg>'
                      }
                      alt="thumb"
                    />
                    <div className="overlay" />
                  </div>
                  <small>{b}</small>
                </div>
              ))}
            </div>
          </div>
          
          
      
          {mainUrl && (
            <div className="inline-controls">
              <label>
                Opacity:{" "}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={mainOpacity}
                  onChange={(e) => {
                    setMainOpacity(parseFloat(e.target.value));
                    pushHistory("main-opacity");
                  }}
                />
              </label>

              <label>
                Blend:
                <select
                  value={mainBlend}
                  onChange={(e) => {
                    setMainBlend(e.target.value);
                    pushHistory("main-blend");
                  }}
                >
                  {BLEND_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Rotate:{" "}
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={mainRotation}
                  onChange={(e) => {
                    setMainRotation(parseFloat(e.target.value));
                  }}
                />
              </label>

              <label>
                Scale:{" "}
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={mainScale}
                  onChange={(e) => {
                    setMainScale(parseFloat(e.target.value));
                  }}
                />
              </label>

              <label>
                FlipH:{" "}
                <input
                  type="checkbox"
                  checked={mainFlipH}
                  onChange={(e) => {
                    setMainFlipH(e.target.checked);
                    pushHistory("main-flipH");
                  }}
                />
              </label>
              <label>
                FlipV:{" "}
                <input
                  type="checkbox"
                  checked={mainFlipV}
                  onChange={(e) => {
                    setMainFlipV(e.target.checked);
                    pushHistory("main-flipV");
                  }}
                />
              </label>

              <div className="filter-row">
                <label>
                  Blur:{" "}
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={mainFilter.blur}
                    onChange={(e) => {
                      setMainFilter((prev) => ({ ...prev, blur: parseFloat(e.target.value) }));
                    }}
                  />
                </label>
                <label>
                  Saturate:{" "}
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.05"
                    value={mainFilter.saturate}
                    onChange={(e) =>
                      setMainFilter((prev) => ({ ...prev, saturate: parseFloat(e.target.value) }))
                    }
                  />
                </label>
              </div>
            </div>
          )}

          
          <div className="selected-controls">
            <strong>Selected:</strong> {selectedType || "none"}{" "}
            {selectedObject && (
              <>
                <div className="sel-row">
                  <label style={{ marginRight: 8 }}>Scale:</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.01"
                    value={selectedObject.scale ?? 1}
                    onChange={(e) => {
                      const s = parseFloat(e.target.value);
                      if (selectedObject.type === "main") {
                        setMainScale(s);
                        pushHistory("main-scale");
                      } else if (selectedObject.type === "bg") {
                        setBgScale(s);
                        pushHistory("bg-scale");
                      } else if (selectedObject.id) {
                        // layer or text
                        if (selectedType === "layer") updateLayer(selectedObject.id, { scale: s });
                        if (selectedType === "text") updateText(selectedObject.id, { scale: s });
                      }
                    }}
                  />
                </div>

                {selectedType === "layer" && (
                  <div className="sel-row">
                    <label>Opacity:</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={layers.find((l) => l.id === selectedId)?.opacity ?? 1}
                      onChange={(e) => updateLayer(selectedId, { opacity: parseFloat(e.target.value) })}
                    />
                  </div>
                )}

                {selectedType === "text" && (
                  <div className="sel-row">
                    <label>Font size:</label>
                    <input
                      type="number"
                      value={texts.find((t) => t.id === selectedId)?.fontSize ?? textProps.fontSize}
                      onChange={(e) => updateText(selectedId, { fontSize: parseInt(e.target.value || 28) })}
                    />
                    <label style={{ marginLeft: 8 }}>Color:</label>
                    <input
                      type="color"
                      value={texts.find((t) => t.id === selectedId)?.fill ?? textProps.fill}
                      onChange={(e) => updateText(selectedId, { fill: e.target.value })}
                    />
                    <button
                      onClick={() => {
                        const t = texts.find((x) => x.id === selectedId);
                        if (t) {
                          setEditText(t.text);
                          setEditTarget(t.id);
                          setIsEditing(true);
                        }
                      }}
                    >
                      Edit Text
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

   
          <div className="text-controls">
            <input
              placeholder="Text"
              value={textProps.text}
              onChange={(e) => setTextProps({ ...textProps, text: e.target.value })}
            />
            <input
              type="number"
              value={textProps.fontSize}
              onChange={(e) => setTextProps({ ...textProps, fontSize: parseInt(e.target.value || 28) })}
              style={{ width: 70 }}
            />
            <input
              type="color"
              value={textProps.fill}
              onChange={(e) => setTextProps({ ...textProps, fill: e.target.value })}
            />
            <input
              type="color"
              value={textProps.background}
              onChange={(e) => setTextProps({ ...textProps, background: e.target.value })}
            />
            <label>
              Scale:
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.01"
                value={textProps.scale}
                onChange={(e) => setTextProps({ ...textProps, scale: parseFloat(e.target.value) })}
              />
            </label>
            <button onClick={addText}>Add Text</button>
          </div>

          <div className="row">
            <label>Stickers:</label>
            <div className="stickers">
              {[
                "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
                "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png",
              ].map((s, i) => (
                <img key={i} src={s} onClick={() => handleSticker(s)} alt="sticker" style={{ width: 40, cursor: "pointer" }} />
              ))}
            </div>
            <button onClick={handleTemplate}>Load Template</button>
            <button
              onClick={async () => {
                const dataUrl = await exportCanvas();
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "banner.png";
                link.click();
              }}
            >
              Export PNG
            </button>
            <button onClick={handleExportToServer}>Export to Server</button>
          </div>
        </div>

        <div style={{marginTop:'5%'}} >
      
          <canvas
            ref={canvasRef}
            width={900}
            height={400}
            className="preview-canvas"
            onPointerDown={() => {
              setSelectedId(null);
              setSelectedType(null);
            }}
          />

          {bgUrl ? (
            <img src={bgUrl} className="bg-image" alt="bg" />
          ) : (
            <div className="bg-placeholder" />
          )}

          {selectedPreviewBlend && (
            <div className="preview-thumb-overlay">
              <div className="preview-thumb-label">Selected preview</div>
              <div className="preview-thumb">
                <img
                  src={mainUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="%23ff7a18"/></svg>'}
                  alt="preview"
                  className="preview-thumb-img"
                  style={{ mixBlendMode: selectedPreviewBlend }}
                />
              </div>
            </div>
          )}


          {mainUrl && (
            <div
              style={{
                position: "absolute",
                left: mainPos.x,
                top: mainPos.y,
                width: mainSize.w * mainScale,
                height: mainSize.h * mainScale,
                transform: `rotate(${mainRotation}deg)`,
                transformOrigin: "center center",
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelectedId("main");
                setSelectedType("main");
                onMainPointerDown(e);
              }}
            >
              <img
                ref={mainRef}
                src={mainUrl}
                alt="main"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${mainFlipH ? -1 : 1}, ${mainFlipV ? -1 : 1})`,
                  mixBlendMode: mainBlend,
                  opacity: mainOpacity,
                  filter: formatFilterString(mainFilter),
                  pointerEvents: "auto",
                }}
              />

            
              {["tl", "tr", "bl", "br"].map((corner) => (
                <div key={corner} onPointerDown={(e) => onMainResizePointerDown(e, corner)} className={`resize-handle ${corner}`} />
              ))}

              
              <div onPointerDown={(e) => onMainRotatePointerDown(e)} className="rotate-handle" />
            </div>
          )}

  
          {layers.map((l) => (
            <div
              key={l.id}
              style={{
                position: "absolute",
                left: l.pos.x,
                top: l.pos.y,
                width: (l.size.w || 100) * (l.scale ?? 1),
                height: (l.size.h || 100) * (l.scale ?? 1),
                transform: `rotate(${l.rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={l.url}
                alt="layer"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  mixBlendMode: l.blendMode,
                  opacity: l.opacity,
                  transform: `scale(${l.flipH ? -1 : 1}, ${l.flipV ? -1 : 1})`,
                }}
                onPointerDown={(e) => onLayerPointerDown(e, l)}
              />

              {["tl", "tr", "bl", "br"].map((corner) => (
                <div key={corner} onPointerDown={(e) => onLayerResizePointerDown(e, l, corner)} className={`resize-handle ${corner}`} />
              ))}

              <div onPointerDown={(e) => onLayerRotatePointerDown(e, l)} className="rotate-handle" />
            </div>
          ))}

      
          {texts.map((t) => (
            <div
              key={t.id}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                transform: `rotate(${t.rotation || 0}deg) scale(${t.scale ?? 1})`,
                cursor: "grab",
                userSelect: "none",
                transformOrigin: "left top",
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onTextPointerDown(e, t);
              }}
              onDoubleClick={() => handleDblClickText(t)}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: 6,
                  background: t.background || "transparent",
                  fontSize: t.fontSize,
                  fontFamily: t.fontFamily,
                  color: t.fill,
                  whiteSpace: "nowrap",
                }}
              >
                {t.text}
              </div>
            </div>
          ))}
        </div>

        </div>
      
      </div>

  );
}
*/



 





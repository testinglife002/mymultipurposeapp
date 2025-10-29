// ✅ BannerMain.jsx
import React, { useRef, useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import "./BannerMain.css";

const BLEND_MODES = [
  "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn",
  "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"
];

export default function BannerMain() {
  const [bgUrl, setBgUrl] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const [blendMode, setBlendMode] = useState("overlay");
  const [opacity, setOpacity] = useState(1);
  const [filter, setFilter] = useState("none");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 400, h: 300 });
  

  const canvasRef = useRef(null);
  const canvaRef = useRef(null);
  const mainRef = useRef(null);
  
  const dragging = useRef(false);
  const drag = useRef(false);
  const resizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const dragingStart = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const resizeStart = useRef({ w: 0, h: 0 });

  const loadImage = (url) => new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });

  const uploadToServer = async (file) => {
    const form = new FormData();
    form.append("image", file);
    const res = await newRequest.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.secure_url;
  };

  const handleBgChoose = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setBgUrl(url);
    try { setBgUrl(await uploadToServer(f)); } catch (err) { console.error(err); }
  };

  const handleMainChoose = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setMainUrl(url);
    try { setMainUrl(await uploadToServer(f)); } catch (err) { console.error(err); }
  };

  const pushHistory = (snapshot) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(JSON.parse(JSON.stringify(snapshot)));
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };
  const undo = () => historyIndex > 0 && (setHistoryIndex(historyIndex - 1), setLayers(JSON.parse(JSON.stringify(history[historyIndex - 1]))));
  const redo = () => historyIndex < history.length - 1 && (setHistoryIndex(historyIndex + 1), setLayers(JSON.parse(JSON.stringify(history[historyIndex + 1]))));

  const addLayer = async (file, type = "main") => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    let cloudUrl = localUrl;
    try {
        cloudUrl = await uploadToServer(file);
    } catch (err) {
        console.error("Upload failed, using local URL:", err);
    }

    const newLayer = {
        id: Date.now().toString(),
        type,
        url: cloudUrl, // ✅ fixed
        pos: { x: 100, y: 100 },
        size: {
        w: type === "background" ? 900 : 400,
        h: type === "background" ? 400 : 300,
        },
        scale: 1,
        rotation: 0,
        opacity: 1,
        blendMode: "normal",
        filter: "none",
        clip: null,
        zIndex: layers.length,
        flipH: false,
        flipV: false,
        effects: {
        glow: false,
        blurEdges: false,
        vignette: false,
        shine: false,
        },
    };

    try {
        const updated = [...layers, newLayer];
        setLayers(updated);
        pushHistory(updated);
        console.log("✅ Added layer:", newLayer);
    } catch (err) {
        console.error("Layer add failed:", err);
    }
    };


  const onPointerDown = (e, id) => {
    e.preventDefault();
    const l = layers.find((x) => x.id === id);
    if (!l) return;
    dragging.current = true;
    setActiveLayer(id);
    dragStart.current = { x: e.clientX, y: e.clientY, sx: l.pos.x, sy: l.pos.y };
  };

  const onPointerMove = (e) => {
    if (!dragging.current && !resizing.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (dragging.current && activeLayer) {
      setLayers((p) => p.map((l) => l.id === activeLayer ? { ...l, pos: { x: dragStart.current.sx + dx, y: dragStart.current.sy + dy } } : l));
    } else if (resizing.current && activeLayer) {
      setLayers((p) => p.map((l) => l.id === activeLayer ? {
        ...l,
        size: { w: Math.max(50, resizeStart.current.w + dx), h: Math.max(50, resizeStart.current.h + dy) }
      } : l));
    }
  };
  const onPointerUp = () => {
    if (dragging.current || resizing.current) pushHistory(layers);
    dragging.current = resizing.current = false;
  };

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    };
    }, [layers, activeLayer]);

   // Dragging (pointer events)
    // dragging for main image
    useEffect(() => {
        const img = mainRef.current;
        if (!img) return;
        const onDown = (ev) => {
        ev.preventDefault();
        dragging.current = true;
        dragStart.current = {
            x: ev.clientX,
            y: ev.clientY,
            sx: pos.x,
            sy: pos.y,
        };
        };
        const onMove = (ev) => {
        if (!dragging.current) return;
        const dx = ev.clientX - dragStart.current.x;
        const dy = ev.clientY - dragStart.current.y;
        setPos({ x: dragStart.current.sx + dx, y: dragStart.current.sy + dy });
        };
        const onUp = () => (dragging.current = false);

        img.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        return () => {
        img.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        };
    }, [pos]);

  const startResize = (e, id) => {
    e.stopPropagation();
    resizing.current = true;
    setActiveLayer(id);
    const l = layers.find((x) => x.id === id);
    resizeStart.current = { w: l.size.w, h: l.size.h, x: e.clientX, y: e.clientY };
  };

  // Resize handle logic
  const onResizePointerDown = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    drag.current = true;
    dragingStart.current = {
      x: ev.clientX,
      y: ev.clientY,
      w: size.w,
      h: size.h
    };
    const onMove = (e) => {
      const dx = e.clientX - dragingStart.current.x;
      const dy = e.clientY - dragingStart.current.y;
      setSize({
        w: Math.max(50, dragingStart.current.w + dx),
        h: Math.max(50, dragingStart.current.h + dy)
      });
    };
    const onUp = () => {
      dragingStart.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

    // 🧠 Draw main preview
    /*
    const drawCanvas = async () => {
        const canva = document.createElement("canvas");
        canva.width = 900;
        canva.height = 400;
        // const ctx = canva.getContext("2d");
        // const canva = canvaRef.current;
        if(!canva) return;
        const ctx = canva.getContext("2d");
        ctx.clearRect(0,0,canva.width,canva.height);
        const sorted = [...layers].sort((a,b)=>a.zIndex-b.zIndex);
        for(const l of sorted){
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = l.url;
            await new Promise(r=>img.onload=r);
            ctx.save();
            // clipping mask
            if(l.clipping){
            ctx.beginPath();
            ctx.rect(l.clipping.x,l.clipping.y,l.clipping.w,l.clipping.h);
            ctx.clip();
            }
            ctx.globalAlpha = l.opacity;
            ctx.filter = l.filter;
            ctx.globalCompositeOperation = l.blendMode;
            const cx = l.pos.x + l.size.w/2;
            const cy = l.pos.y + l.size.h/2;
            ctx.translate(cx, cy);
            ctx.rotate((l.rotation*Math.PI)/180);
            ctx.scale(l.flipH?-1:1, l.flipV?-1:1);
            ctx.drawImage(img, -l.size.w/2, -l.size.h/2, l.size.w, l.size.h);
            ctx.restore();
        }
    
        // draw alignment guides if activeLayer near center
        const active = layers.find(l=>l.id===activeLayer);
        if(active){
            ctx.save();
            ctx.strokeStyle="red";
            ctx.lineWidth=1;
            const snapMargin=5;
            // vertical center
            if(Math.abs((active.pos.x + active.size.w/2) - canva.width/2)<snapMargin){
            ctx.beginPath(); ctx.moveTo(canva.width/2,0); ctx.lineTo(canva.width/2,canva.height); ctx.stroke();
            }
            // horizontal center
            if(Math.abs((active.pos.y + active.size.h/2) - canvas.height/2)<snapMargin){
            ctx.beginPath(); ctx.moveTo(0,canva.height/2); ctx.lineTo(canva.width,canva.height/2); ctx.stroke();
            }
            ctx.restore();
        }
    };

    useEffect(drawCanvas, [layers]);

    const exportCanva = async () => {
        const canva = canvaRef.current;
        const dpr = window.devicePixelRatio||2;
        const exportCanvas = document.createElement("canva");
        exportCanvas.width = canva.width*dpr;
        exportCanvas.height = canva.height*dpr;
        const ctx = exportCanvas.getContext("2d");
        ctx.scale(dpr,dpr);
        await drawCanvas();
        const dataUrl = canva.toDataURL("image/png");
        const res = await newRequest.post("/banner/export",{dataUrl});
        alert("Saved!"); 
      };
    */

    const handleExport = async () => {
      if (!canvasRef.current) return;
      try {
        const canvas = document.createElement("canvas");
        const rect = canvasRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 2;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
  
        // Draw background
        if (bgUrl) {
          const bgImg = await loadImage(bgUrl);
          ctx.drawImage(bgImg, 0, 0, rect.width, rect.height);
        }
  
        // Draw main image with transform
        if (mainUrl) {
          const img = await loadImage(mainUrl);
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.filter = filter;
          ctx.globalCompositeOperation = blendMode;
  
          // center position + rotation + scale + flip
          const cx = pos.x + (size.w * scale) / 2;
          const cy = pos.y + (size.h * scale) / 2;
          ctx.translate(cx, cy);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
          ctx.drawImage(img, - (size.w*scale)/2, - (size.h*scale)/2, size.w*scale, size.h*scale);
          ctx.restore();
        }
  
        // Optional: text overlay
        ctx.save();
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.textBaseline = "top";
        ctx.fillText("Your Banner Text", 20, 20);
        ctx.strokeText("Your Banner Text", 20, 20);
        ctx.restore();
  
        const dataUrl = canvas.toDataURL("image/png");
  
        // Send to backend for saving and cloud upload
        const res = await newRequest.post("/banner/export", {
          dataUrl,
          backgroundUrl: bgUrl,
          mainUrl: mainUrl
        });
        alert(`Saved: local=${res.data.localPath} cloud=${res.data.cloudUrl}`);
        window.open(res.data.cloudUrl, "_blank");
  
      } catch (err) {
        console.error(err);
        alert("Export failed: " + err.message);
      }
    };


  return (
    <div className="banner-container">
      {/* Banner Creator */}
      <div className="banner-section">
        <h2>Banner Creator</h2>
        <div className="controls">
          <label>Background:</label>
          <input type="file" accept="image/*" onChange={handleBgChoose} />
          <label>Main image:</label>
          <input type="file" accept="image/*" onChange={handleMainChoose} />

          <label>Blend:</label>
          <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} style={{color:'black'}} >
            {BLEND_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>

          <label>Opacity:</label>
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(+e.target.value)} />
          <label>Scale:</label>
          <input type="range" min="0.1" max="2" step="0.01" value={scale} onChange={(e) => setScale(+e.target.value)} />
          <label>Rotation:</label>
          <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(+e.target.value)} />

          <div className="flip-row">
            <label><input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} />Flip H</label>
            <label><input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} />Flip V</label>
          </div>
          <div className="btn-row">
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
            <button onClick={handleExport}>Export</button>
          </div>
        </div>

        <div id="canvas" ref={canvasRef} className="canvas">
          {bgUrl && <img src={bgUrl} alt="" className="bg" />}
          {mainUrl && (
            <img
              src={mainUrl}
              ref={mainRef}
              className="main-image"
              alt=""
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: size.w * scale,
                height: size.h * scale,
                transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1},${flipV ? -1 : 1})`,
                opacity,
                mixBlendMode: blendMode,
                filter,
              }}
              onDownPointer={(e) => onDownPointer(e, "main")}
              draggable={false}
            />
          )}
          <div
            className="resize-handling"
            onPointerDown={onResizePointerDown}
          />
        </div>

       

      </div>

      {/* Banner Maker */}
      <div className="banner-section">
        <h2>Banner Maker</h2>
        <div className="controls">
          <label>Background:</label>
          <input type="file" onChange={(e) => addLayer(e.target.files[0], "background")} />
          <label>Main Image:</label>
          <input type="file" onChange={(e) => addLayer(e.target.files[0], "main")} />
          <label>Blend:</label>
          <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} style={{color:'black'}} >
            {BLEND_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
          <label>Opacity:</label>
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(+e.target.value)} />
          <label>Scale:</label>
          <input type="range" min="0.1" max="2" step="0.01" value={scale} onChange={(e) => setScale(+e.target.value)} />
          <label>Rotation:</label>
          <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(+e.target.value)} />

          <div className="flip-row">
            <label><input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} />Flip H</label>
            <label><input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} />Flip V</label>
          </div>
          <div className="btn-row">
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
            <button onClick={handleExport}>Export</button>
          </div>
        </div>

        <div  id="canva" ref={canvaRef} className="canva" style={{height:'400px'}} >
          {layers.map((l) => (
            <div
            key={l.id}
            className={`layer ${activeLayer === l.id ? "active" : ""}`}
            style={{
                position: "absolute",
                left: l.pos.x,
                top: l.pos.y,
                width: l.size.w * l.scale,
                height: l.size.h * l.scale,
                zIndex: l.zIndex,
                backgroundImage: `url(${l.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: l.opacity,
                mixBlendMode: l.blendMode,
                filter: l.filter,
                transform: `rotate(${l.rotation}deg) scale(${l.flipH ? -1 : 1}, ${
                l.flipV ? -1 : 1
                })`,
                border: activeLayer === l.id ? "2px solid #007bff" : "1px solid #ccc",
                boxSizing: "border-box",
                cursor: "move",
            }}
            onPointerDown={(e) => onPointerDown(e, l.id)}
            >
            <div
                className="resize-handle"
                onPointerDown={(e) => startResize(e, l.id)}
            />
            </div>
        ))}
        </div>       

      </div>
    </div>
  );
}

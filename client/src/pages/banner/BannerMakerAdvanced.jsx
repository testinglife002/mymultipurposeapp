import React, { useRef, useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import "./BannerMakerAdvanced.css";

const BLEND_MODES = [
  "normal","multiply","screen","overlay","darken","lighten",
  "color-dodge","color-burn","hard-light","soft-light",
  "difference","exclusion","hue","saturation","color","luminosity"
];


export default function BannerMakerAdvanced() {
  // ---------- Background & Main Image ----------
  const [bgUrl, setBgUrl] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const [mainPos, setMainPos] = useState({ x: 100, y: 50 });
  const [mainSize, setMainSize] = useState({ w: 400, h: 300 });
  const [mainRotation, setMainRotation] = useState(0);
  const [mainFlipH, setMainFlipH] = useState(false);
  const [mainFlipV, setMainFlipV] = useState(false);
  const [mainOpacity, setMainOpacity] = useState(1);
  const [mainBlend, setMainBlend] = useState("normal");

  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const uploadToServer = async (file) => {
    const form = new FormData();
    form.append("image", file);
    const res = await newRequest.post("/uploads", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.secure_url;
  };

  // ---------- Drag & Drop for Main Image ----------
  const onMainPointerDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, sx: mainPos.x, sy: mainPos.y };
    mainRef.current.setPointerCapture(e.pointerId);
  };

  const onMainResizePointerDown = (e, corner) => {
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: mainSize.w, h: mainSize.h, corner };
    mainRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (dragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setMainPos({ x: dragStart.current.sx + dx, y: dragStart.current.sy + dy });
    } else if (resizing.current) {
      const { corner, w, h } = resizeStart.current;
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      let newW = w;
      let newH = h;
      let newX = mainPos.x;
      let newY = mainPos.y;

      switch(corner){
        case "br":
          newW = Math.max(50, w + dx);
          newH = Math.max(50, h + dy);
          break;
        case "bl":
          newW = Math.max(50, w - dx);
          newH = Math.max(50, h + dy);
          newX = mainPos.x + dx;
          break;
        case "tr":
          newW = Math.max(50, w + dx);
          newH = Math.max(50, h - dy);
          newY = mainPos.y + dy;
          break;
        case "tl":
          newW = Math.max(50, w - dx);
          newH = Math.max(50, h - dy);
          newX = mainPos.x + dx;
          newY = mainPos.y + dy;
          break;
      }

      setMainSize({ w: newW, h: newH });
      setMainPos({ x: newX, y: newY });
    }
  };

  const onPointerUp = (e) => {
    dragging.current = false;
    resizing.current = false;
    try { mainRef.current.releasePointerCapture(e.pointerId); } catch {}
  };

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [mainPos, mainSize]);

  // ---------- Rotation ----------
    const rotating = useRef({ active:false, layerId:null, startAngle:0 });

    const onRotationPointerDown = (e, layer) => {
    e.stopPropagation();
    rotating.current = { active:true, layerId: layer.id, startAngle:0 };
    };

    const onMainRotationPointerDown = (e) => {
    e.stopPropagation();
    rotating.current = { active:true, layerId: "main", startAngle:0 };
    };

    const calculateAngle = (cx, cy, x, y) => {
    return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
    };

    const onPointerMoveRotation = (e) => {
    if (!rotating.current.active) return;

    const layerId = rotating.current.layerId;

    if(layerId === "main"){
        const cx = mainPos.x + mainSize.w/2;
        const cy = mainPos.y + mainSize.h/2;
        const angle = calculateAngle(cx, cy, e.clientX, e.clientY);
        setMainRotation(angle);
    } else {
        setLayers(prev => prev.map(l => {
        if(l.id !== layerId) return l;
        const cx = l.pos.x + l.size.w/2;
        const cy = l.pos.y + l.size.h/2;
        const angle = calculateAngle(cx, cy, e.clientX, e.clientY);
        return {...l, rotation: angle};
        }));
    }
    };

    const onPointerUpRotation = () => { rotating.current.active = false; };

    useEffect(() => {
    window.addEventListener("pointermove", onPointerMoveRotation);
    window.addEventListener("pointerup", onPointerUpRotation);
    return () => {
        window.removeEventListener("pointermove", onPointerMoveRotation);
        window.removeEventListener("pointerup", onPointerUpRotation);
    };
    }, [mainPos, mainSize, layers]);

  // ---------- File upload ----------
  const handleBgChoose = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBgUrl(URL.createObjectURL(f));
  };
  const handleMainChoose = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setMainUrl(URL.createObjectURL(f));
  };

  // ---------- Layers ----------
  // const [layers, setLayers] = useState([]);
  // const [activeLayer, setActiveLayer] = useState(null);

  const addLayer = async (file, type = "main") => {
    if (!file) return;
    const url = await uploadToServer(file);
    const newLayer = {
      id: Date.now().toString(),
      type,
      url,
      pos: { x: 50, y: 50 },
      size: { w: type === "background" ? 900 : 400, h: type === "background" ? 400 : 300 },
      scale: 1,
      rotation: 0,
      opacity: 1,
      blendMode: "normal",
      filter: "none",
      flipH: false,
      flipV: false,
      zIndex: layers.length + 1,
    };
    const updated = [...layers, newLayer];
    setLayers(updated);
    pushHistory(updated);
  };

  const pushHistory = (snapshot) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(JSON.parse(JSON.stringify(snapshot)));
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayers(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // ---------- Drag & Resize for Layers ----------
  const layerDragging = useRef(false);
  const layerResizing = useRef({ active:false, corner:"" });
  const layerDragStart = useRef({ x:0, y:0, sx:0, sy:0 });
  const layerResizeStart = useRef({ x:0, y:0, w:0, h:0 });

  const onLayerPointerDown = (e, layer) => {
    e.stopPropagation();
    layerDragging.current = true;
    setActiveLayer(layer.id);
    layerDragStart.current = { x:e.clientX, y:e.clientY, sx:layer.pos.x, sy:layer.pos.y };
  };

  const onLayerResizePointerDown = (e, layer, corner) => {
    e.stopPropagation();
    layerResizing.current = { active:true, corner, layerId: layer.id };
    layerResizeStart.current = { x:e.clientX, y:e.clientY, w: layer.size.w, h: layer.size.h, sx: layer.pos.x, sy: layer.pos.y };
  };

  const onLayerPointerMove = (e) => {
    // Drag
    if(layerDragging.current && activeLayer){
      setLayers(prev => prev.map(l=>{
        if(l.id!==activeLayer) return l;
        const dx = e.clientX - layerDragStart.current.x;
        const dy = e.clientY - layerDragStart.current.y;
        return {...l, pos:{ x: layerDragStart.current.sx + dx, y: layerDragStart.current.sy + dy }};
      }));
    }

    // Resize
    if(layerResizing.current.active){
      setLayers(prev => prev.map(l=>{
        if(l.id !== layerResizing.current.layerId) return l;
        const { corner } = layerResizing.current;
        const dx = e.clientX - layerResizeStart.current.x;
        const dy = e.clientY - layerResizeStart.current.y;
        let newW = layerResizeStart.current.w;
        let newH = layerResizeStart.current.h;
        let newX = layerResizeStart.current.sx;
        let newY = layerResizeStart.current.sy;

        switch(corner){
          case "br":
            newW = Math.max(20, layerResizeStart.current.w + dx);
            newH = Math.max(20, layerResizeStart.current.h + dy);
            break;
          case "bl":
            newW = Math.max(20, layerResizeStart.current.w - dx);
            newH = Math.max(20, layerResizeStart.current.h + dy);
            newX = layerResizeStart.current.sx + dx;
            break;
          case "tr":
            newW = Math.max(20, layerResizeStart.current.w + dx);
            newH = Math.max(20, layerResizeStart.current.h - dy);
            newY = layerResizeStart.current.sy + dy;
            break;
          case "tl":
            newW = Math.max(20, layerResizeStart.current.w - dx);
            newH = Math.max(20, layerResizeStart.current.h - dy);
            newX = layerResizeStart.current.sx + dx;
            newY = layerResizeStart.current.sy + dy;
            break;
        }

        return { ...l, size:{ w:newW, h:newH }, pos:{ x:newX, y:newY } };
      }));
    }
  };

  const onLayerPointerUp = () => { layerDragging.current = false; layerResizing.current = { active:false, corner:"" }; };

  useEffect(() => {
    window.addEventListener("pointermove", onLayerPointerMove);
    window.addEventListener("pointerup", onLayerPointerUp);
    return () => {
      window.removeEventListener("pointermove", onLayerPointerMove);
      window.removeEventListener("pointerup", onLayerPointerUp);
    };
  }, [activeLayer]);

  // ---------- Export ----------
  const exportCanvas = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    if(bgUrl){
      const bg = new Image();
      bg.crossOrigin = "anonymous";
      bg.src = bgUrl;
      await new Promise(r=>bg.onload=r);
      ctx.drawImage(bg,0,0,canvas.width,canvas.height);
    }

    if(mainUrl){
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = mainUrl;
      await new Promise(r=>img.onload=r);
      ctx.save();
      ctx.globalAlpha = mainOpacity;
      ctx.globalCompositeOperation = mainBlend;
      ctx.translate(mainPos.x + mainSize.w/2, mainPos.y + mainSize.h/2);
      ctx.rotate((mainRotation * Math.PI)/180);
      ctx.scale(mainFlipH?-1:1, mainFlipV?-1:1);
      ctx.drawImage(img, -mainSize.w/2, -mainSize.h/2, mainSize.w, mainSize.h);
      ctx.restore();
    }

    for(const l of layers){
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = l.url;
      await new Promise(r=>img.onload=r);
      ctx.save();
      ctx.globalAlpha = l.opacity;
      ctx.globalCompositeOperation = l.blendMode;
      ctx.translate(l.pos.x + l.size.w/2, l.pos.y + l.size.h/2);
      ctx.rotate((l.rotation*Math.PI)/180);
      ctx.scale(l.flipH?-1:1, l.flipV?-1:1);
      ctx.drawImage(img, -l.size.w/2, -l.size.h/2, l.size.w, l.size.h);
      ctx.restore();
    }

    const dataUrl = canvas.toDataURL("image/png");
    const res = await newRequest.post("/banner/export",{dataUrl});
    alert("Saved! " + res.data.cloudUrl);
  };

  return (
    <div className="banner-maker">
      <div className="banner-section">
        <h2>Banner Creator</h2>
        <div className="controls" style={{background:'white', padding:'10px'}}>
          <label>Background:</label>
          <input type="file" onChange={handleBgChoose} />
          <label>Main Image:</label>
          <input type="file" onChange={handleMainChoose} />
          <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
            <button onClick={exportCanvas}>Export</button>
          </div>

          {/* Inline controls for main image */}
          {mainUrl && (
            <>
            <div style={{marginTop:'10px', background:'#f0f0f0', padding:'6px', borderRadius:'4px'}}>
              <label>Opacity: <input type="range" min="0" max="1" step="0.01" value={mainOpacity} onChange={e=>setMainOpacity(parseFloat(e.target.value))} /></label>
              <label>Blend:
                <select value={mainBlend} onChange={e=>setMainBlend(e.target.value)}>
                  {BLEND_MODES.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label>Rotate: <input type="range" min="0" max="360" value={mainRotation} onChange={e=>setMainRotation(parseFloat(e.target.value))} /></label>
              <label>FlipH: <input type="checkbox" checked={mainFlipH} onChange={e=>setMainFlipH(e.target.checked)} /></label>
              <label>FlipV: <input type="checkbox" checked={mainFlipV} onChange={e=>setMainFlipV(e.target.checked)} /></label>
            </div>
            <div className="btn-row">
              <button onClick={undo}>Undo</button>
              <button onClick={redo}>Redo</button>
            </div>
          </>
          )}
        </div>

        {/* Canvas */}
        <div className="preview-wrap" style={{position:'relative', width:'900px', height:'400px', marginTop:'10px'}} ref={canvasRef}>
          {bgUrl && <img src={bgUrl} alt="bg" style={{position:'absolute', width:'100%', height:'100%'}} />}
          {mainUrl && (
            <div style={{position:'absolute', left:mainPos.x, top:mainPos.y}}>
                <img
                src={mainUrl}
                ref={mainRef}
                style={{
                    width: mainSize.w,
                    height: mainSize.h,
                    cursor: "grab",
                    transform: `rotate(${mainRotation}deg) scale(${mainFlipH?-1:1},${mainFlipV?-1:1})`,
                    opacity: mainOpacity,
                    mixBlendMode: mainBlend,
                }}
                onPointerDown={onMainPointerDown}
                draggable={false}
                />
                {/* Resize Handles */}
                {["tl","tr","bl","br"].map(corner=>(
                <div key={corner} onPointerDown={(e)=>onMainResizePointerDown(e,corner)}
                    style={{
                    position:'absolute', width:'12px', height:'12px', background:'cyan',
                    cursor: corner+"-resize",
                    top: corner.includes("t")?0:'auto',
                    bottom: corner.includes("b")?0:'auto',
                    left: corner.includes("l")?0:'auto',
                    right: corner.includes("r")?0:'auto',
                    }}
                />
                ))}
                {/* Rotation Handle */}
                <div onPointerDown={onMainRotationPointerDown}
                style={{
                    position:'absolute',
                    width:'14px', height:'14px',
                    borderRadius:'50%',
                    background:'orange',
                    top: -20, left: '50%',
                    transform: 'translateX(-50%)',
                    cursor:'grab',
                }}
                />
            </div>
            )}

          {/* Layers */}

        {layers.map(l=>(
        <div key={l.id} style={{position:'absolute', left:l.pos.x, top:l.pos.y}}>
            <img
            src={l.url}
            style={{
                width: l.size.w,
                height: l.size.h,
                cursor:'grab',
                transform:`rotate(${l.rotation}deg) scale(${l.flipH?-1:1},${l.flipV?-1:1})`,
                opacity: l.opacity,
                mixBlendMode: l.blendMode
            }}
            onPointerDown={(e)=>onLayerPointerDown(e,l)}
            draggable={false}
            />
            {/* Resize Handles */}
            {["tl","tr","bl","br"].map(corner=>(
            <div key={corner} onPointerDown={(e)=>onLayerResizePointerDown(e,l,corner)}
                style={{
                position:'absolute',
                width:'10px', height:'10px',
                background:'red',
                cursor: corner+'-resize',
                top: corner.includes("t")?0:'auto',
                bottom: corner.includes("b")?0:'auto',
                left: corner.includes("l")?0:'auto',
                right: corner.includes("r")?0:'auto',
                }}
            />
            ))}
            {/* Rotation Handle */}
            <div onPointerDown={(e)=>onRotationPointerDown(e,l)}
            style={{
                position:'absolute',
                width:'12px', height:'12px',
                borderRadius:'50%',
                background:'orange',
                top: -20, left: '50%',
                transform: 'translateX(-50%)',
                cursor:'grab',
            }}
            />
        </div>
        ))}

        </div>
      </div>
    </div>  
  );  
}

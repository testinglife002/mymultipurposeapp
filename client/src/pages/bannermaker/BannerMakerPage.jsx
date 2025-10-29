// BannerMakerPage.jsx
import React, { useState } from "react";
import CanvasEditor from "./CanvasEditor";
import ElementControls from "./ElementControls";
import BlendModeSelector from "./BlendModeSelector";
import LayersPanel from "./LayersPanel";
import TextTools from "./TextTools";
import MiniCanvasEditor from "./MiniCanvasEditor";
import newRequest from "../../api/newRequest";
import "./BannerMakerPage.css";

export default function BannerMakerPage() {
  const [bg, setBg] = useState({
    id: "background",
    type: "background",
    url: "",
    x: 0,
    y: 0,
    w: 900,
    h: 600,
    scale: 1,
    rotation: 0,
    opacity: 1,
    blur: 0,
    blendMode: "normal",
  });

  const [main, setMain] = useState({
    id: "main",
    type: "main",
    url: "",
    x: 100,
    y: 80,
    w: 400,
    h: 300,
    scale: 1,
    rotation: 0,
    opacity: 1,
    blur: 0,
    blendMode: "normal",
  });

  const [layers, setLayers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selected, setSelected] = useState({ type: null, id: null });
  const [showLayers, setShowLayers] = useState(true); // toggle floating panel

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) setBg((p) => ({ ...p, url: URL.createObjectURL(file) }));
  };

  const handleMainUpload = (e) => {
    const file = e.target.files[0];
    if (file) setMain((p) => ({ ...p, url: URL.createObjectURL(file) }));
  };

  const handleAddLayer = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newLayer = {
      id: Date.now(),
      type: "layer",
      url: URL.createObjectURL(file),
      x: 150,
      y: 150,
      w: 200,
      h: 150,
      scale: 1,
      rotation: 0,
      opacity: 1,
      blur: 0,
      blendMode: "normal",
    };
    setLayers([...layers, newLayer]);
    setSelected({ type: "layer", id: newLayer.id });
  };

  const handleDelete = () => {
    if (selected.type === "background") setBg({ ...bg, url: "" });
    else if (selected.type === "main") setMain({ ...main, url: "" });
    else if (selected.type === "layer") setLayers(layers.filter((l) => l.id !== selected.id));
    else if (selected.type === "text") setTexts(texts.filter((t) => t.id !== selected.id));
    setSelected({ type: null, id: null });
  };

  // Inside BannerMakerPage component
  const saveTemplate = async () => {
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
    };

  const selectedElement =
    selected.type === "background"
      ? bg
      : selected.type === "main"
      ? main
      : selected.type === "layer"
      ? layers.find((l) => l.id === selected.id)
      : selected.type === "text"
      ? texts.find((t) => t.id === selected.id)
      : null;


    

  return (
    <div className="banner-maker-container">
      <div className="toolbar p-2 d-flex gap-3 flex-wrap">
        <label className="btn btn-primary btn-sm">
          Background <input type="file" hidden onChange={handleBgUpload} />
        </label>
        <label className="btn btn-success btn-sm">
          Main Image <input type="file" hidden onChange={handleMainUpload} />
        </label>
        {/*<label className="btn btn-info btn-sm">
          Add Layer <input type="file" hidden onChange={handleAddLayer} />
        </label>*/}
        {selected.type && (
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
           <span style={{color:'black'}}> Delete Selected </span>
          </button>
        )}

        <button className="btn btn-warning btn-sm" onClick={saveTemplate}>
         <span style={{color:'black'}}> Save Template </span>
        </button>

        {/* Toggle Floating Layers Panel */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowLayers((p) => !p)}
        >
          <span style={{color:'black'}}> {showLayers ? "Hide Layers" : "Show Layers"} </span>
        </button>

      </div>

      <div className="editor-layout">
        <div className="left-panel">

          <LayersPanel
            bg={bg}
            main={main}
            layers={layers}
            texts={texts}
            selected={selected}
            setSelected={setSelected}
          />
          
          <BlendModeSelector
            selectedElement={selectedElement}
            onSelectBlend={(blend) => {
              if (selected.type === "background") setBg((p) => ({ ...p, blendMode: blend }));
              else if (selected.type === "main") setMain((p) => ({ ...p, blendMode: blend }));
              else if (selected.type === "layer")
                setLayers((prev) =>
                  prev.map((l) => (l.id === selected.id ? { ...l, blendMode: blend } : l))
                );
              else if (selected.type === "text")
                setTexts((prev) =>
                  prev.map((t) => (t.id === selected.id ? { ...t, blendMode: blend } : t))
                );
            }}
          />
        </div>

        <div className="canvas-wrapper">
          <CanvasEditor
            bg={bg}
            setBg={setBg}
            main={main}
            setMain={setMain}
            layers={layers}
            setLayers={setLayers}
            texts={texts}
            setTexts={setTexts}
            selected={selected}
            setSelected={setSelected}
          />

          
        </div>

        <div className="right-panel">
          <ElementControls
            selected={selected}
            bg={bg}
            setBg={setBg}
            main={main}
            setMain={setMain}
            layers={layers}
            setLayers={setLayers}
            texts={texts}
            setTexts={setTexts}
          />
          <TextTools texts={texts} setTexts={setTexts} selected={selected} setSelected={setSelected} />

          <div className="mini-canvas-wrapper mt-3">
            <h6>Mini Canvas</h6>
            <MiniCanvasEditor texts={texts} selected={selected} setTexts={setTexts} setSelected={setSelected} scale={0.2} />
          </div>  
        
        </div>
      </div>

      {/* ✅ Floating Layers Panel */}
      {/* 
      {showLayers && (
        <LayersPanel
          bg={bg}
          main={main}
          layers={layers}
          texts={texts}
          selected={selected}
          setSelected={setSelected}
        />
      )}
       */}

    </div>
  );
}



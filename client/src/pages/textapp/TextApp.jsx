// ✅ src/pages/textapp/TextApp.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import TextSidebar from "./components/TextSidebar";
import CanvasView from "./components/CanvasView";
import LayerPanel from "./components/LayerPanel";
import ExportControls from "./components/ExportControls";
import "./components/variables.css";
import "./components/AppLayout.css";
import { v4 as uuidv4 } from "uuid";
import BgControls from "./components/BgControls";

const initialLayers = [
  { id: "bg-1", type: "background", url: "", opacity: 0.8, blur: 0, zIndex: 0 },
  {
    id: "text-1",
    type: "text",
    text: "Hello, styled world!\nResize me and try effects",
    fontSize: 48,
    fontFamily: "Inter, system-ui, Arial",
    fontWeight: 700,
    color: "#ffffff",
    x: 50,
    y: 50,
    zIndex: 1,
    width: 520,
    height: 140,
    effect: "neon",
    palette: ["#fff"],
    clipPath: null,
    maskSettings: {},
    playback: { playing: true, speed: 1 },
  },
];

export default function TextApp() {
  const [templates, setTemplates] = useState([]);
  const [current, setCurrent] = useState(null);
  const [layers, setLayers] = useState(initialLayers);
  const [selectedLayer, setSelectedLayer] = useState(initialLayers[1].id);
  const [hoverEffect, setHoverEffect] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showBgControls, setShowBgControls] = useState(false)

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await newRequest.get("/text-templates");
      setTemplates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  }

  // ✅ When selecting a template from sidebar
  useEffect(() => {
    if (!current) return;

    let tplLayers = [];

    if (Array.isArray(current.layers) && current.layers.length > 0) {
      tplLayers = current.layers.map((l, idx) => ({
        ...l,
        id: l.id || `layer-${idx}-${Date.now()}`,
        zIndex: l.zIndex ?? idx + 1,
      }));
    } else {
      // fallback: convert single-text template into layered format
      tplLayers = [
        {
          id: uuidv4(),
          type: "background",
          url: current.bgImageUrl || "",
          opacity: current.opacity ?? 1,
          blur: current.blur ?? 0,
          zIndex: 0,
        },
        {
          id: uuidv4(),
          type: "text",
          text: current.text || "Untitled",
          fontSize: current.fontSize || 48,
          fontFamily: "Inter, system-ui, Arial",
          fontWeight: 700,
          color: current.color || "#fff",
          palette: current.palette || [current.color || "#fff"],
          effect: current.effect || "",
          x: current.pos?.x ?? 50,
          y: current.pos?.y ?? 50,
          zIndex: 1,
          width: 500,
          height: 150,
          playback: { playing: true, speed: 1 },
        },
      ];
    }

    setLayers(tplLayers);
    const firstText = tplLayers.find((l) => l.type === "text");
    setSelectedLayer(firstText ? firstText.id : null);
  }, [current]);

  const handleUpdateLayer = (id, key, value) =>
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [key]: value } : l))
    );

  const handleSelectPreset = (presetId, palette = []) =>
    setLayers((prev) =>
      prev.map((l) =>
        l.type === "text" && l.id === selectedLayer
          ? { ...l, effect: presetId, palette, color: palette[0] ?? l.color }
          : l
      )
    );

  const handleAddTextLayer = () => {
    const highestZ = layers.length
      ? Math.max(...layers.map((l) => l.zIndex ?? 0))
      : 0;
    const newLayer = {
      id: uuidv4(),
      type: "text",
      text: "New text layer",
      fontSize: 36,
      fontFamily: "Inter, system-ui, Arial",
      fontWeight: 600,
      color: "#fff",
      x: 50,
      y: 50,
      zIndex: highestZ + 1,
      width: 420,
      height: 100,
      effect: "",
      clipPath: null,
      maskSettings: {},
      playback: { playing: true, speed: 1 },
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await newRequest.delete(`/text-templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
      if (current?._id === id) setCurrent(null);
    } catch (err) {
      console.error("Failed to delete template", err);
    }
  };

  // ✅ updated to send FormData with optional file (matching backend)
  const handleSaveTemplate = async () => {
    try {
      const payload = {
        name: current?.name || `Template ${Date.now()}`,
        layers,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // optional background file could be added here later
      if (current?.bgFile) formData.append("file", current.bgFile);

      if (current?._id) {
        await newRequest.put(`/text-templates/${current._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Template updated!");
      } else {
        const res = await newRequest.post("/text-templates", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCurrent(res.data);
        setTemplates((prev) => [res.data, ...prev]);
        alert("Template saved!");
      }

      fetchTemplates();
    } catch (err) {
      console.error("Failed to save template", err);
      alert("Error saving template");
    }
  };

  const selectedLayerObj = layers.find((l) => l.id === selectedLayer) || null;

  return (
    <div className="app-root">
      <TextSidebar
        templates={templates}
        onSelect={(tpl) => setCurrent(tpl)}
        onPresetSelect={handleSelectPreset}
        onPresetHover={(pId) => setHoverEffect(pId)}
        layers={layers}
        selectedLayer={selectedLayerObj}
        selectedLayerId={selectedLayer}
        onDeleteTemplate={handleDeleteTemplate}
      />
      <main className="main-area">
        <div className="top-controls">
          <button className="btn" onClick={handleAddTextLayer}>
            + Add Text Layer
          </button>
          <ExportControls canvasId="studio-canvas" template={current} />
        </div>
        <div className="workspace">
          <CanvasView
            id="studio-canvas"
            layers={layers}
            template={current}
            selectedLayer={selectedLayer}
            hoverEffect={hoverEffect}
            showOverlay={showOverlay}
            onSelectLayer={(id) => setSelectedLayer(id)}
            onUpdateLayer={handleUpdateLayer}
            onSaveTemplate={handleSaveTemplate}
            showBgControls={showBgControls}
          />
          <div className="right-panel">
            <LayerPanel
              layers={layers}
              selectedLayer={selectedLayer}
              showOverlay={showOverlay}
              onToggleOverlay={setShowOverlay}
              onSelectLayer={setSelectedLayer}
              onUpdateLayer={handleUpdateLayer}
              showBgControls={showBgControls}
              setShowBgControls={setShowBgControls}
            />

            {/*<BgControls
              backgroundLayer={layers.find((l) => l.type === "background")}
              onUpdateLayer={handleUpdateLayer}
            />
            */}
          </div>
        </div>
      </main>
    </div>
  );
}




/*
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import TextSidebar from "./components/TextSidebar";
import CanvasView from "./components/CanvasView";
import LayerPanel from "./components/LayerPanel";
import ExportControls from "./components/ExportControls";
import "./components/variables.css";
import "./components/AppLayout.css";
import { v4 as uuidv4 } from "uuid";

const initialLayers = [
  { id: "bg-1", type: "background", url: "", opacity: 0.8, blur: 0, zIndex: 0 },
  {
    id: "text-1",
    type: "text",
    text: "Hello, styled world!\nResize me and try effects",
    fontSize: 48,
    fontFamily: "Inter, system-ui, Arial",
    fontWeight: 700,
    color: "#ffffff",
    x: 50,
    y: 50,
    zIndex: 1,
    width: 520,
    height: 140,
    effect: "neon",
    clipPath: null,
    maskSettings: {},
    playback: { playing: true, speed: 1 },
  },
];

export default function TextApp() {
  const [templates, setTemplates] = useState([]);
  const [current, setCurrent] = useState(null);
  const [layers, setLayers] = useState(initialLayers);
  const [selectedLayer, setSelectedLayer] = useState(initialLayers[1].id);
  const [hoverEffect, setHoverEffect] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true); // overlay toggle

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 🔹 Fetch templates from backend
  async function fetchTemplates() {
    try {
      const res = await newRequest.get("/text-templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    }
  }

  // 🔹 Handle layer reorder (move up/down)
  const handleReorderLayers = (id, dir) => {
    setLayers((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const swap = dir === "up" ? idx + 1 : idx - 1;
      if (swap < 0 || swap >= arr.length) return prev;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr.map((l, i) => ({ ...l, zIndex: i + 1 }));
    });
  };

  // 🔹 Background upload via Cloudinary
  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "mymultipurposeapp");
    const res = await fetch("https://api.cloudinary.com/v1_1/dvnxusfy8/image/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setLayers((prev) => prev.map((l) => (l.type === "background" ? { ...l, url: data.secure_url } : l)));
  };

  // 🔹 Add new text layer
  const handleAddTextLayer = () => {
    const nl = {
      id: uuidv4(),
      type: "text",
      text: "New text layer",
      fontSize: 36,
      fontFamily: "Inter, system-ui, Arial",
      fontWeight: 600,
      color: "#fff",
      x: 50,
      y: 50,
      zIndex: Math.max(...layers.map((l) => l.zIndex)) + 1,
      width: 420,
      height: 100,
      effect: "",
      clipPath: null,
      maskSettings: {},
      playback: { playing: true, speed: 1 },
    };
    setLayers((prev) => [...prev, nl]);
    setSelectedLayer(nl.id);
  };

  // 🔹 Update specific layer property
  const handleUpdateLayer = (id, key, value) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  };

  // 🔹 Apply text preset
  const handleSelectPreset = (presetId, palette = []) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.type === "text" && l.id === selectedLayer
          ? { ...l, effect: presetId, palette, color: palette[0] ?? l.color }
          : l
      )
    );
  };

  // 🔹 Delete saved template
  const handleDeleteTemplate = async (id) => {
    try {
      await newRequest.delete(`/text-templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete template", err);
    }
  };

  // 🔹 Auto-load template layers when `current` changes
  // 🔹 Auto-load template layers when `current` changes
  useEffect(() => {
    if (!current) return;

    const tplLayers = Array.isArray(current?.layers)
      ? current.layers.map((l, idx) => ({
          ...l,
          id: l.id || `tpl-${idx}-${Date.now()}`,
          zIndex: l.zIndex ?? idx + 1,
        }))
      : [];

    if (tplLayers.length > 0) {
      setLayers(tplLayers);

      const firstTextLayer = tplLayers.find((l) => l.type === "text");
      if (firstTextLayer) setSelectedLayer(firstTextLayer.id);
    }
  }, [current]);


  // 🔹 Handle preset hover
  const handleHoverPreset = (presetId) => setHoverEffect(presetId);

  const selectedLayerObj = layers.find((l) => l.id === selectedLayer) || null;

  return (
    <div className="app-root">
      <TextSidebar
        templates={templates}
        onSelect={(tpl) => setCurrent(tpl)}
        onPresetSelect={(pId, palette) => handleSelectPreset(pId, palette)}
        onPresetHover={(pId) => handleHoverPreset(pId)}
        layers={layers}
        selectedLayerId={selectedLayer}
        selectedLayer={selectedLayerObj}
        onDeleteTemplate={handleDeleteTemplate}
      />

      <main className="main-area">
        <div className="top-controls">
          <button className="btn" onClick={handleAddTextLayer}>
            + Add Text Layer
          </button>
          <ExportControls canvasId="studio-canvas" template={current} />
        </div>

        <div className="workspace">
          <CanvasView
            id="studio-canvas"
            layers={layers}
            template={current}
            selectedLayer={selectedLayer}
            hoverEffect={hoverEffect}
            showOverlay={showOverlay}
            onSelectLayer={(id) => setSelectedLayer(id)}
            onUpdateLayer={(id, key, value) => handleUpdateLayer(id, key, value)}
          />

          <div className="right-panel">
            <LayerPanel
              layers={layers}
              selectedLayer={selectedLayer}
              showOverlay={showOverlay}
              onToggleOverlay={(val) => setShowOverlay(val)}
              onSelectLayer={(id) => setSelectedLayer(id)}
              onUpdateLayer={(id, keyOrPatch, maybeValue) => {
                if (typeof keyOrPatch === "string") {
                  handleUpdateLayer(id, keyOrPatch, maybeValue);
                } else {
                  const patch = keyOrPatch || {};
                  setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
                }
              }}
              onReorderLayers={handleReorderLayers}
              onBgUpload={(file) => {
                if (file instanceof File) {
                  const fake = { target: { files: [file] } };
                  handleBgUpload(fake);
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
*/




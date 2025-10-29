// EditTemplatePage.jsx
// EditTemplatePage.jsx
import React, { useEffect, useState } from "react";
import CanvasEditor from "./CanvasEditor";
import ElementControls from "./ElementControls";
import BlendModeSelector from "./BlendModeSelector";
import LayersPanel from "./LayersPanel";
import TextTools from "./TextTools";
import MiniCanvasEditor from "./MiniCanvasEditor";
import newRequest from "../../api/newRequest";
import "./BannerMakerPage.css";

export default function EditTemplatePage({ templateId }) {
  const [bg, setBg] = useState(null);
  const [main, setMain] = useState(null);
  const [layers, setLayers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selected, setSelected] = useState({ type: null, id: null });
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 Fetch template on mount
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await newRequest.get(`/text-templates/${templateId}`);
        const t = res.data;

        setTemplateName(t.name || "Untitled Template");

        // Initialize elements
        setBg({
          id: "background",
          type: "background",
          url: t.bgImageUrl,
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

        setMain({
          id: "main",
          type: "main",
          url: t.mainImageUrl,
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

        setLayers(t.layers || []);
        setTexts(t.texts || []);
      } catch (err) {
        console.error("❌ Failed to load template:", err);
        alert("Failed to load template data.");
      }
    };

    loadTemplate();
  }, [templateId]);

  // ✅ Identify selected element
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

  // ✅ Save or Update Template
  const saveEditedTemplate = async () => {
    try {
      setIsSaving(true);

      const updatedTemplate = {
        name: templateName,
        bgImageUrl: bg?.url || "",
        mainImageUrl: main?.url || "",
        layers: layers.map((l) => ({ ...l })),
        texts: texts.map((t) => ({ ...t })),
      };

      const res = await newRequest.put(`/text-templates/${templateId}`, updatedTemplate);
      alert("✅ Template updated successfully!");
      console.log("Updated Template:", res.data);
    } catch (err) {
      console.error("❌ Failed to update template:", err);
      alert("❌ Failed to update template.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!bg || !main) return <p className="text-center mt-4">Loading template...</p>;

  return (
    <div className="banner-maker-container">
      {/* 🔹 Toolbar */}
      <div className="toolbar p-2 d-flex gap-3 flex-wrap align-items-center border-bottom">
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <button
          className="btn btn-warning btn-sm"
          onClick={saveEditedTemplate}
          disabled={isSaving}
        >
          {isSaving ? "💾 Saving..." : "💾 Save Changes"}
        </button>
      </div>

      {/* 🔹 Main Layout */}
      <div className="editor-layout">
        {/* Left Panel */}
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
              if (selected.type === "background")
                setBg((p) => ({ ...p, blendMode: blend }));
              else if (selected.type === "main")
                setMain((p) => ({ ...p, blendMode: blend }));
              else if (selected.type === "layer")
                setLayers((prev) =>
                  prev.map((l) =>
                    l.id === selected.id ? { ...l, blendMode: blend } : l
                  )
                );
              else if (selected.type === "text")
                setTexts((prev) =>
                  prev.map((t) =>
                    t.id === selected.id ? { ...t, blendMode: blend } : t
                  )
                );
            }}
          />
        </div>

        {/* Canvas Center */}
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

        {/* Right Panel */}
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

          <TextTools
            texts={texts}
            setTexts={setTexts}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Mini Canvas (Live Preview of Text Positions) */}
          <div className="mini-canvas-wrapper mt-3">
            <h6>Mini Canvas (Live Positional Preview)</h6>
            <MiniCanvasEditor
              texts={texts}
              selected={selected}
              setTexts={setTexts}
              setSelected={setSelected}
              scale={0.2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


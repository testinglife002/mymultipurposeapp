// 🧩 src/pages/textapp/components/TextSidebar.jsx
import React, { useMemo, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import EffectPreview from "./EffectPreview";
import PalettePicker from "./PalettePicker";
import "./TextSidebar.css";
import PRESETS from "./PRESETS.js";

export default function TextSidebar({
  templates = [],
  onSelect,
  onPresetSelect,
  onPresetHover,
  layers = [],
  selectedLayer,
  selectedLayerId,
  onDeleteTemplate,
}) {
  const [openTemplates, setOpenTemplates] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const firstLine = useMemo(() => {
    if (!selectedLayer || typeof selectedLayer.text !== "string") return "";
    return selectedLayer.text.split("\n")[0] || "";
  }, [selectedLayer]);

  const handleTemplateClick = (t) => {
    onSelect?.(t);
    // close the expanded list so user sees the canvas update
    setOpenTemplates(false);
    setModalOpen(false);
  };

  return (
    <aside className="text-sidebar">
      <div className="sidebar-top">
        <h3 className="sidebar-title">Text Effects</h3>
        <div className="live-preview">
          <div className="live-preview-label">Selected (live)</div>
          <div
            className="live-preview-box"
            style={{
              fontFamily: selectedLayer?.fontFamily || "inherit",
              fontWeight: selectedLayer?.fontWeight || 400,
              fontSize: Math.min(selectedLayer?.fontSize || 36, 28),
            }}
            title={firstLine}
          >
            {firstLine || <em className="muted">No text on selected layer</em>}
          </div>
        </div>
      </div>

      <div className="preset-list">
        {PRESETS.map((preset) => (
          <EffectPreview
            key={preset.id}
            preset={preset}
            onApply={() => onPresetSelect && onPresetSelect(preset.id, preset.palette)}
            onHover={() => onPresetHover && onPresetHover(preset.id)}
            onLeave={() => onPresetHover && onPresetHover(null)}
          />
        ))}
      </div>

      <hr className="sidebar-divider" />

      <div className="text-sidebar-saved">
        <div className="saved-header">
          <h4>Saved Templates</h4>
          <button className="btn small" onClick={() => setOpenTemplates((v) => !v)}>
            <FiChevronRight className={openTemplates ? "rotated" : ""} />
          </button>
          <button className="btn small" onClick={() => setModalOpen(true)}>
            Manage Templates
          </button>
        </div>

        {openTemplates && (
          <div className="templates-list">
            {templates.length === 0 && <div className="muted">No templates</div>}
            {templates.map((t) => (
              <div key={t._id} className="template-item">
                <div className="template-title" onClick={() => handleTemplateClick(t)}>
                  {t.name}
                </div>
                <div className="template-meta">{t.layers?.length ?? ""} layers</div>
                <button
                  className="btn small delete"
                  onClick={() => {
                    onDeleteTemplate?.(t._id);
                    // keep UI state consistent
                    if (openTemplates && templates.length <= 1) setOpenTemplates(false);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Templates</h3>
              {templates.length === 0 && <div className="muted">No templates</div>}
              {templates.map((t) => (
                <div key={t._id} className="template-item">
                  <span
                    onClick={() => handleTemplateClick(t)}
                    style={{ cursor: "pointer" }}
                  >
                    {t.name}
                  </span>
                  <button className="btn tiny" onClick={() => onDeleteTemplate?.(t._id)}>
                    Delete
                  </button>
                </div>
              ))}
              <button className="btn" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <PalettePicker
        palette={selectedLayer?.palette || [selectedLayer?.color || "#fff"]}
        onChange={(newPalette) => {
          if (selectedLayer) {
            onPresetSelect?.(selectedLayer.effect, newPalette);
          }
        }}
      />
    </aside>
  );
}





/*
import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import newRequest from "../../../api/newRequest";
import EffectPreset from './EffectPreset';
import PalettePicker from './PalettePicker';
import './variables.css';
import './TextSidebar.css';

const PRESETS = [
  { id: 'animatedGradient', label: 'Animated Gradient', palette: ['#ff7a18','#ffd200'] },
  { id: 'neon', label: 'Neon', palette: ['#0ff','#06f'] },
  { id: 'wavy', label: 'Wave Letters', palette: ['#222','#555'] },
  { id: 'typewriter', label: 'Typewriter', palette: ['#111'] },
  { id: 'shimmer', label: 'Shimmer / Shine', palette: ['#fff','#f0f'] },
  { id: 'maskReveal', label: 'Mask Reveal', palette: ['#fff','#000'] },
  { id: 'chrome', label: 'Chrome / Metallic', palette: ['#aaa','#fff'] },
  { id: 'glitch', label: 'Glitch', palette: ['#f00','#0ff'] },
  { id: 'fire', label: 'Fire / Burning', palette: ['#ff3300','#ffaa00'] },
  { id: 'aurora', label: 'Aurora / Northern Lights', palette: ['#0ff','#f0f','#ff0'] },
  { id: 'cityNight', label: 'City Nights', palette: ['#0ff','#06f'] },
  { id: 'wooden', label: 'Wooden Typography', palette: ['#8B4513','#CD853F'] },
  { id: 'metallic', label: 'Metallic Gradient', palette: ['#aaa','#fff','#ddd'] },
  { id: 'pulsing3D', label: 'Pulsing 3D Depth', palette: ['#0ff','#06f','#fff'] },
  { id: '3dRotate', label: '3D Rotate', palette: ['#fff','#ccc'] },
  { id: 'gooeyMarquee', label: 'Gooey Marquee', palette: ['#ff0','#f0f'] },
  { id: 'clipHover', label: 'Clip-path Hover', palette: ['#ff0','#0ff'] },
  { id: 'dynamicTypewriter', label: 'Dynamic Typewriter', palette: ['#fff','#f0f'] },
  { id: 'splitHover', label: 'Split Hover Effect', palette: ['#ff0','#f0f'] },
];

export default function TextSidebar({ templates = [], onCreate, onSelect, onApply }) {
  const [name, setName] = useState("New Template");
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (preset) => {
    const body = {
      name,
      text: 'Hello world',
      effect: preset.id,
      fontSize: 72,
      color: preset.palette[0],
      palette: preset.palette
    };
    try {
      const res = await newRequest.post('/text-templates', { data: JSON.stringify(body) });
      onCreate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="text-sidebar">
      <div className="text-sidebar-header">
        <h3>Text Effects</h3>
        <div className="text-sidebarcreate-row">
          <input value={name} onChange={(e)=>setName(e.target.value)} className="input" />
          <button className="text-sidebar-btn" onClick={()=>handleCreate(PRESETS[0])}><FiPlus /></button>
        </div>
      </div>

      <div className="text-sidebarpreset-list">
        {PRESETS.map(p => (
          <EffectPreset
            key={p.id}
            preset={p}
            onCreate={handleCreate}
            onApply={(effectId) => onUpdateEffect(effectId)} // real-time application
          />
        ))}
      </div>

      <hr />

      <div className="text-sidebar-saved-list">
        <h4>Saved Templates</h4>
        <button className="btn" onClick={()=>setShowModal(true)}>Open Template Library</button>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h4>Select Template</h4>
              {templates.map(t => (
                <div key={t._id} className="template-item">
                  <span onClick={() => { onSelect(t); setShowModal(false); }}>{t.name}</span>
                  <button className="btn-sm" onClick={async ()=>{
                    if (window.confirm('Delete this template?')) {
                      await newRequest.delete(`/text-templates/${t._id}`);
                      setShowModal(false);
                    }
                  }}>Delete</button>
                </div>
              ))}
              <button className="btn" onClick={()=>setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      <PalettePicker />
    </aside>
  );
}
*/

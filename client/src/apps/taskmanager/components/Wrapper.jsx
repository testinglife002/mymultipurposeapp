// Wrapper.jsx
import React from "react";
import "./Wrapper.css";

export default function Wrapper({ open, setOpen, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={setOpen}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        {children}
      </div>
    </div>
  );
}


import React from "react";
import "./ButtonUI.css";

export default function ButtonUI({
  label,
  icon = null,
  type = "button",
  onClick = () => {},
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`custom-btn ${className} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {label && <span className="btn-label">{label}</span>}
    </button>
  );
}

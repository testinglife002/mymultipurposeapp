// apps/taskmanager/components/Loader.jsx
import React from "react";
import "./Loader.css";

const Loader = ({ size = 40, text = "Loading..." }) => {
  return (
    <div className="loader-wrapper">
      <div
        className="loader-spinner"
        style={{ width: size, height: size, borderWidth: size / 8 }}
      ></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;

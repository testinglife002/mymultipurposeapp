// apps/taskmanager/components/Tabs.jsx
import React, { useState } from "react";
import "./Tabs.css";

export default function Tabs({ tabs = [], setSelected, children }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (setSelected) setSelected(index);
  };

  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            className={`tab-button ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-title">{tab.title}</span>
          </button>
        ))}
      </div>

      <div className="tab-panels">
        {React.Children.toArray(children)[activeIndex]}
      </div>
    </div>
  );
}

// src/website/components/homegordius/Topbar.jsx
import React from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="gordius-topbar">
      <div className="gordius-topbar-left">
        <h1>Gordius Blog</h1>
      </div>
      <div className="gordius-topbar-right">
        <div className="gordius-topbar-icon">
          <FiSearch />
        </div>
        <div className="gordius-topbar-icon">
          <FiBell />
        </div>
        <div className="gordius-topbar-icon gordius-profile">
          <FiUser />
        </div>
      </div>
    </header>
  );
}

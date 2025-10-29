// src/website/components/homegordius/Header.jsx
import React, { useState } from "react";
import { Menu, X, Home, Info, Phone, Bell } from "lucide-react";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="gordius-header">
      <nav className="gordius-navbar">
        <div className="gordius-logo">My Blog</div>
        <button className="gordius-menu-toggle" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

        <ul className={`gordius-nav-links ${open ? "gordius-open" : ""}`}>
          <li><a href="#"><Home size={18}/> Home</a></li>
          <li><a href="#"><Info size={18}/> About</a></li>
          <li><a href="#"><Phone size={18}/> Contact</a></li>
          <li><a href="#" className="gordius-subscribe"><Bell size={18}/> Subscribe</a></li>
        </ul>
      </nav>
    </header>
  );
}

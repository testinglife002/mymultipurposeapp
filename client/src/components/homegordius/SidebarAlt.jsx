// src/website/components/homegordius/SidebarAlt.jsx
import React from "react";
import { FiGithub, FiTwitter, FiFacebook } from "react-icons/fi";
import "./SidebarAlt.css";

export default function SidebarAlt() {
  return (
    <aside className="gordius-sidebar-alt">
      <section className="gordius-sidebar-box">
        <h5>About</h5>
        <p>
          Welcome to our blog! We share tech insights, tutorials, and trending topics weekly.
        </p>
      </section>

      <section className="gordius-sidebar-box">
        <h5>Archives</h5>
        <ul>
          <li>March 2025</li>
          <li>February 2025</li>
          <li>January 2025</li>
        </ul>
      </section>

      <section className="gordius-sidebar-box">
        <h5>Elsewhere</h5>
        <ul className="gordius-socials">
          <li><FiGithub /></li>
          <li><FiTwitter /></li>
          <li><FiFacebook /></li>
        </ul>
      </section>
    </aside>
  );
}


// src/website/components/homegordius/MarqueeBar.jsx
import React from "react";
import Marquee from "react-fast-marquee";
import { FiZap } from "react-icons/fi";
import "./MarqueeBar.css";

const breakingNews = [
  "React 19 announced with amazing features!",
  "Bootstrap 6 alpha testing underway!",
  "Web accessibility guidelines updated for 2025!",
  "New CSS properties to simplify layouts!",
];

export default function MarqueeBar() {
  return (
    <div className="gordius-marquee-bar">
      <FiZap className="gordius-marquee-icon" />
      <Marquee pauseOnHover={true} gradient={false} speed={60}>
        {breakingNews.map((news, index) => (
          <span key={index} className="gordius-marquee-text">
            {news}
          </span>
        ))}
      </Marquee>
    </div>
  );
}


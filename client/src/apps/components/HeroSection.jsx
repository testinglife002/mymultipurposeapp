// components/appmaterial/HeroSection.jsx
import React, { useEffect } from 'react';
import './HeroSection.css';

export default function HeroSection() {
  useEffect(() => console.log('🎬 HeroSection mounted'));

  return (
    <div className="app-mat-hero-section">
      <video
        className="app-mat-hero-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="app-mat-hero-overlay">
        <h1 className="app-mat-hero-title">Welcome to Your Dashboard</h1>
        <h3 className="app-mat-hero-subtitle">Everything you need in one place</h3>
      </div>
    </div>
  );
}

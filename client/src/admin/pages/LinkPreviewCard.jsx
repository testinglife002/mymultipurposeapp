// src/components/LinkPreviewCard.jsx

import React, { useState } from "react";
import "./LinkPreviewCard.css";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const LinkPreviewCard = ({ title, description, images = [], url }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!title && !description && images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="link-preview-card">
      {images.length > 0 && (
        <div className="image-carousel">
          <img
            src={images[currentIndex]}
            alt="preview"
            className="preview-image"
          />
          {images.length > 1 && (
            <>
              <button className="carousel-btn left" onClick={prevImage}>
                <ChevronLeft size={18} />
              </button>
              <button className="carousel-btn right" onClick={nextImage}>
                <ChevronRight size={18} />
              </button>
              <div className="carousel-dots">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === currentIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="link-info">
        <h4 className="link-title">{title}</h4>
        <p className="link-description">{description}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-url"
        >
          <ExternalLink size={14} /> {new URL(url).hostname}
        </a>
      </div>
    </div>
  );
};

export default LinkPreviewCard;
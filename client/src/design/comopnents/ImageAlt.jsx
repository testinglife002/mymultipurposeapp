// ✅ ImageAlt.jsx
import React from "react";
import "./ImageAlt.css";

const ImageAlt = ({ addImage, images, type, setImage }) => {
  return (
    <div className="image-grid">
      {images.map((item, i) => (
        <div
          key={i}
          className="image-item"
          onClick={() =>
            type === "background"
              ? setImage(item.image_url)
              : addImage(item.image_url)
          }
        >
          <img src={item.image_url} alt="Item" />
        </div>
      ))}
    </div>
  );
};

export default ImageAlt;
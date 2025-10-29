// src/components/PostMedia.jsx
import React, { useState } from "react";

const PostMedia = ({ images = [], primaryImg, audioUrl, videoUrl }) => {
  const [selectedImage, setSelectedImage] = useState(primaryImg || images?.[0]?.url);

  return (
    <div className="post-media">
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="selected"
          className="main-image"
          onClick={() => setSelectedImage(selectedImage)}
        />
      ) : (
        <div className="no-image">No Image</div>
      )}

      {images?.length > 0 && (
        <div className="thumbnails">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`thumb-${i}`}
              className={selectedImage === img.url ? "active" : ""}
              onClick={() => setSelectedImage(img.url)}
            />
          ))}
        </div>
      )}

      {audioUrl && <audio controls src={audioUrl} className="audio" />}
      {videoUrl && <video controls src={videoUrl} className="video" />}
    </div>
  );
};

export default PostMedia;

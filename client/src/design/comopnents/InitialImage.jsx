// ✅ InitialImage.jsx
import React, { useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import ImageAlt from "./ImageAlt";
import "./InitialImage.css";

const InitialImage = ({ addImage }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImages = async () => {
      const { data } = await newRequest.get("/design-images");
      setImages(data.images);
    };
    getImages();
  }, []);

  return (
    <div className="initial-image-container">
      <ImageAlt addImage={addImage} images={images} />
    </div>
  );
};

export default InitialImage;
// ✅ BackgroundImage.jsx
import React, { useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import ImageAlt from "./ImageAlt";
import "./BackgroundImage.css";

const BackgroundImage = ({ setImage, type }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImages = async () => {
      const { data } = await newRequest.get("/background-images");
      setImages(data.images);
    };
    getImages();
  }, []);

  return (
    <div className="background-image-container">
      <ImageAlt setImage={setImage} type={type} images={images} />
    </div>
  );
};

export default BackgroundImage;
// ✅ MyImagesAlt.jsx
import React, { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";
import newRequest from "../../api/newRequest";
import ImageAlt from "./ImageAlt";
import "./MyImagesAlt.css";

const MyImagesAlt = ({ addImage }) => {
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  const imageUpload = async (e) => {
    if (e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      setLoader(true);
      const { data } = await newRequest.post("/add-user-image", formData);
      setImages([...images, data.userImage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await newRequest.get("/get-user-image");
        setImages(data.images);
      } catch (err) {
        console.error("❌ Failed to fetch user images:", err);
      }
    };
    fetchImages();
  }, []);


  return (
    <div className="my-images-container">
      <label className="upload-btn" htmlFor="image">
        Upload Image
        <input
          id="image"
          type="file"
          style={{ display: "none" }}
          disabled={loader}
          onChange={imageUpload}
        />
      </label>

      {loader && (
        <div className="loader-container">
          <BarLoader color="#fff" />
        </div>
      )}

      <div className="scrollable">
        <ImageAlt addImage={addImage} images={images} />
      </div>
    </div>
  );
};

export default MyImagesAlt;
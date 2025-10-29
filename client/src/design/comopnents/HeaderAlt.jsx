// 🧩 Step 2: Update HeaderAlt.jsx
//Add a small toggle button beside the “Download” button:
// HeaderAlt.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { Save, Download, PanelRightOpen, Layers } from "lucide-react";
import newRequest from "../../api/newRequest";
import "./HeaderAlt.css";

const HeaderAlt = ({ components, designId, toggleRightPanel, toggleLayersPanel }) => {
  const [loader, setLoader] = useState(false);

   // ✅ Save design (both JSON + preview image)
  const saveImage = async () => {
    const designElement = document.getElementById("main_design");

    if (!designElement) {
      console.error("❌ Error: #main_design element not found.");
      return;
    }

    try {
      setLoader(true);
      const imageBlob = await htmlToImage.toBlob(designElement);
      if (!imageBlob) {
        console.error("❌ Failed to generate image blob.");
        return;
      }

      const designData = { design: components };
      const formData = new FormData();
      formData.append("design", JSON.stringify(designData));
      formData.append("image", imageBlob);

      // ✅ Correct URL (avoid /api/api duplication)
      await newRequest.put(`/update-user-design/${designId}`, formData);

      console.log("✅ Design saved successfully.");
    } catch (error) {
      console.error("❌ Save failed:", error.response?.data?.message || error.message);
    } finally {
      setLoader(false);
    }
  };

  // ✅ Download as PNG
  const downloadImage = async () => {
    const designElement = document.getElementById("main_design");

    if (!designElement) {
      console.error("❌ Error: #main_design element not found.");
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(designElement, {
        style: { transform: "scale(1)" },
      });

      const link = document.createElement("a");
      link.download = "design.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("❌ Download failed:", error.message);
    }
  };

  return (
    <header className="canva-header-alt">
      {/* Left: Logo */}
      <div className="canva-header-left">
        <Link to="/" className="canva-logo-link">
          <img
            src="https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg"
            alt="Mini Canva"
            className="canva-logo-img"
          />
        </Link>
        <span className="canva-app-name">Mini Canva</span>
      </div>

      {/* Right: Buttons */}
      <div className="canva-header-right">
        <button
          disabled={loader}
          onClick={saveImage}
          className={`canva-header-btn ${loader ? "loading" : ""}`}
        >
          <Save size={16} />
          {loader ? "Saving..." : "Save"}
        </button>

        <button onClick={downloadImage} className="canva-header-btn">
          <Download size={16} />
          Download
        </button>

        <button onClick={() => toggleLayersPanel()}>
          <Layers size={20} />
        </button>

        {toggleRightPanel && (
          <button
            onClick={toggleRightPanel}
            className="canva-header-btn toggle-right-btn"
            title="Toggle right panel"
          >
            <PanelRightOpen size={16} />
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderAlt;


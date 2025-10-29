// BannerList.jsx:
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";

export default function BannerList({ onEdit }) {
  const [banners, setBanners] = useState([]);
  

  const fetchBanners = async () => {
    try {
      const res = await newRequest.get("/banner");
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await newRequest.delete(`/banner/${id}`);
      setBanners(prev => prev.filter(b => b._id !== id));
      alert("Banner deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner");
    }
  };

  const handleEdit = (banner) => {
    onEdit(banner); // Pass banner data to BannerMakerNew for editing
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {banners.map(b => (
        <div key={b._id} style={{ border: "1px solid #ccc", padding: 5, width: 200 }}>
          <img src={b.exportedUrl} alt="banner" style={{ width: "100%", height: 100, objectFit: "cover" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <button onClick={() => handleEdit(b)}>Edit</button>
            <button onClick={() => handleDelete(b._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
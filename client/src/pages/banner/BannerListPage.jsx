import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerList from "./BannerList";

export default function BannerListPage() {
  const navigate = useNavigate();
  const [bannerToEdit, setBannerToEdit] = useState(null);

  const handleEdit = (banner) => {
    setBannerToEdit(banner);
    // Navigate to BannerMakerNew and pass banner via state
    navigate("/banner-maker", { state: { banner } });
  };

  return (
    <div>
      <h1>All Banners</h1>
      <BannerList onEdit={handleEdit} />
    </div>
  );
}

// src/components/AutoLinkPreviewCard.jsx

import React, { useEffect, useState } from "react";
import "./LinkPreviewCard.css";
import { Loader2 } from "lucide-react";
import LinkPreviewCard from "./LinkPreviewCard";
import newRequest from "../../api/newRequest"; // your Axios instance

const AutoLinkPreviewCard = ({ link }) => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      if (!link || !link.startsWith("http")) return;
      setLoading(true);
      try {
        const res = await newRequest.get(`/og/fetch`, { params: { url: link } });
        if (res.data.success) {
          setMeta(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch OG meta:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, [link]);

  if (!link) return null;
  if (loading)
    return (
      <div className="link-preview-loading">
        <Loader2 className="spin" /> Fetching preview...
      </div>
    );
  if (!meta) return null;

  return (
    <LinkPreviewCard
      title={meta.title}
      description={meta.description}
      images={meta.images}
      url={meta.url}
    />
  );
};

export default AutoLinkPreviewCard;
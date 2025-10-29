// src/website/components/homegordius/TwoSidePosts.jsx
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import "./TwoSidePosts.css";

const twoSidePosts = [
  { id: 1, title: "Frontend Frameworks 2025", image: "https://picsum.photos/id/1020/500/300", link: "#" },
  { id: 2, title: "Backend Trends to Watch", image: "https://picsum.photos/id/1021/500/300", link: "#" },
];

export default function TwoSidePosts() {
  return (
    <section className="gordius-two-side-posts">
      <div className="gordius-post-left">
        <img src={twoSidePosts[0].image} alt={twoSidePosts[0].title} />
        <div className="gordius-post-info">
          <h3>{twoSidePosts[0].title}</h3>
          <a href={twoSidePosts[0].link}>
            Read more <FiArrowRight />
          </a>
        </div>
      </div>
      <div className="gordius-post-right">
        <img src={twoSidePosts[1].image} alt={twoSidePosts[1].title} />
        <div className="gordius-post-info">
          <h3>{twoSidePosts[1].title}</h3>
          <a href={twoSidePosts[1].link}>
            Read more <FiArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

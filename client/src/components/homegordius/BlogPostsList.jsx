// src/website/components/homegordius/BlogPostsList.jsx
// src/components/BlogPostsList.jsx
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import "./BlogPostsList.css";

const posts = [
  { id: 1, title: "Understanding React 19", excerpt: "A deep dive into the latest React 19 features and hooks.", date: "September 25, 2025", image: "https://picsum.photos/id/1015/800/400", link: "#" },
  { id: 2, title: "CSS Grid vs Flexbox", excerpt: "When to use CSS Grid and when Flexbox works better.", date: "September 20, 2025", image: "https://picsum.photos/id/1016/800/400", link: "#" },
  { id: 3, title: "JavaScript Async Patterns", excerpt: "Mastering async/await, promises, and callbacks in JS.", date: "September 15, 2025", image: "https://picsum.photos/id/1018/800/400", link: "#" },
];

export default function BlogPostsList() {
  return (
    <section className="gordius-blog-posts-list">
      <h2>Latest Posts</h2>
      <div className="gordius-posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="gordius-post-card">
            <img src={post.image} alt={post.title} />
            <div className="gordius-post-content">
              <h3>{post.title}</h3>
              <small>{post.date}</small>
              <p>{post.excerpt}</p>
              <a href={post.link}>
                Read more <FiArrowRight />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// src/website/components/homegordius/FeaturedPostSlider.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiArrowRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedPostSlider.css";

const featuredPosts = [
  { id: 1, title: "Featured Post One", date: "April 20, 2025", image: "https://picsum.photos/id/1018/1200/600", excerpt: "Preview of featured post one.", link: "#" },
  { id: 2, title: "Featured Post Two", date: "April 15, 2025", image: "https://picsum.photos/id/1023/1200/600", excerpt: "Preview of featured post two.", link: "#" },
  { id: 3, title: "Featured Post Three", date: "April 10, 2025", image: "https://picsum.photos/id/1031/1200/600", excerpt: "Preview of featured post three.", link: "#" },
];

export default function FeaturedPostSlider() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section className="gordius-featured-slider">
      <h2>Featured Posts</h2>

      <Swiper
        style={{
          "--swiper-navigation-color": "#ff6f61",
          "--swiper-pagination-color": "#ff6f61",
        }}
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs, Navigation, Pagination, Autoplay]}
        className="gordius-main-swiper"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="gordius-featured-slide">
              <img src={post.image} alt={post.title} />
              <div className="gordius-featured-caption">
                <h3>{post.title}</h3>
                <small>{post.date}</small>
                <p>{post.excerpt}</p>
                <a href={post.link}>
                  Continue reading <FiArrowRight />
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        loop
        freeMode
        watchSlidesProgress
        modules={[Thumbs]}
        className="gordius-thumbs-swiper"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={`thumb-${post.id}`}>
            <img src={post.image} alt={post.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

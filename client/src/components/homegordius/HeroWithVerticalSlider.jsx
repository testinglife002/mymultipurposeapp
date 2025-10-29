// src/website/components/homegordius/HeroWithVerticalSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Autoplay, Pagination } from "swiper/modules";
import { FaFacebook, FaTwitter, FaInstagram, FaPlus } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "./HeroWithVerticalSlider.css";

const slides = [
  { id: 1, title: "Sunrise Beach", image: "https://cdn.wallpapersafari.com/47/81/GvPV8B.jpg" },
  { id: 2, title: "Forest Trail", image: "https://images.hdqwalls.com/download/canyonlands-sunrise-4k-dn-1360x768.jpg" },
  { id: 3, title: "Snowy Mountains", image: "https://thumbs.dreamstime.com/b/nature-thailand-rice-farm-44919269.jpg" },
];

export default function HeroWithVerticalSlider() {
  return (
    <div className="gordius-hero-slider">
      <div className="gordius-hero-content">
        <h1>Explore Nature</h1>
        <p>Discover the world’s most stunning landscapes.</p>
        <button className="gordius-cta-btn">Get Started</button>
        <div className="gordius-social-icons">
          <a href="#"><FaFacebook/></a>
          <a href="#"><FaTwitter/></a>
          <a href="#"><FaInstagram/></a>
        </div>
      </div>

      <div className="gordius-slider-panel">
        <Swiper
          direction="vertical"
          modules={[Mousewheel, Autoplay, Pagination]}
          mousewheel
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          slidesPerView={1}
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div className="gordius-slide">
                <img src={slide.image} alt={slide.title} />
                <span>{slide.title}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="gordius-fab"><FaPlus/></button>
      </div>
    </div>
  );
}

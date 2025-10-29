// components/appmaterial/Slideshow.jsx
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import './Slideshow.css';

const horizontalSlides = [
  'https://source.unsplash.com/random/800x300?nature',
  'https://source.unsplash.com/random/800x301?tech',
  'https://source.unsplash.com/random/800x302?city',
];

const verticalSlides = [
  '📢 Big update released!',
  '🔥 Hot deals this week!',
  '✅ System maintenance on Sunday',
];

export default function Slideshow() {
  useEffect(() => console.log('🎞 Slideshow loaded'));

  return (
    <div className="app-mat-slideshow">
      {/* Horizontal Slides */}
      <div className="app-mat-horizontal-slides">
        <Swiper
          modules={[Autoplay, Scrollbar]}
          autoplay={{ delay: 3000 }}
          loop
          spaceBetween={16}
          scrollbar={{ draggable: true }}
        >
          {horizontalSlides.map((src, idx) => (
            <SwiperSlide key={idx}>
              <img src={src} alt={`Slide ${idx + 1}`} className="app-mat-slide-img" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Vertical Announcements */}
      <div className="app-mat-vertical-slides">
        <h3 className="app-mat-announcement-title">📣 Announcements</h3>
        <Swiper
          direction="vertical"
          modules={[Autoplay, Scrollbar]}
          autoplay={{ delay: 2000 }}
          loop
          scrollbar={{ draggable: true }}
        >
          {verticalSlides.map((text, idx) => (
            <SwiperSlide key={idx} className="app-mat-announcement-slide">
              {text}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

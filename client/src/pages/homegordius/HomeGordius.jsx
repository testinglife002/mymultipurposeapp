// src/website/pages/HomeGordius.jsx
// src/pages/homegordius/HomeGordius.jsx
import React, { useState } from "react";
import "./HomeGordius.css";
import Topbar from "../../components/homegordius/Topbar";
import MarqueeBar from "../../components/homegordius/MarqueeBar";
import Header from "../../components/homegordius/Header";
import FeaturedPostSlider from "../../components/homegordius/FeaturedPostSlider";
import TwoSidePosts from "../../components/homegordius/TwoSidePosts";
import SidebarAlt from "../../components/homegordius/SidebarAlt";
import BlogPostsList from "../../components/homegordius/BlogPostsList";
import HeroWithVerticalSlider from "../../components/homegordius/HeroWithVerticalSlider";
import HeroSection from "../../components/homegordius/HeroSection";
import Sidebar from "../../components/homegordius/Sidebar";


export default function HomeGordius() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="gordius-home">
      <div className="gordius-topbar-wrapper">
        <Topbar />
        <MarqueeBar />
      </div>

      <Header />

      <main className="gordius-content-area">
        <FeaturedPostSlider />
        <TwoSidePosts />
        <div className="gordius-content-row">
          <aside className="gordius-left-col">
            <SidebarAlt />
          </aside>
          <section className="gordius-right-col">
            <BlogPostsList />
            {/*<HeroWithVerticalSlider />*/}    
           {/*<HeroSection />*/}
          </section>
        </div>

        {<HeroSection />}
      </main>
    </div>
  );
}




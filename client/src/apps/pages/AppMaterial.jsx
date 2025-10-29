// src/apps/pages/appmaterial/AppMaterial.jsx
// AppMaterial.jsx
import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import './AppMaterial.css';
import AppBarHeader from '../components/AppBarHeader';
import Sidebar from '../components/Sidebar';
import SubSidebar from '../components/SubSidebar';
// import HeroSection from '../components/HeroSection';
// import Slideshow from '../components/Slideshow';
// import ContentSectionAlt from '../components/ContentSectionAlt';
// import WidgetsSection from '../components/WidgetsSection';
import SettingsPanel from '../components/SettingsPanel';
import NotificationsPanel from '../components/NotificationsPanel';
import Footer from '../components/Footer';

function AppMaterial() {
  const [mode, setMode] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedSubTab, setSelectedSubTab] = useState('sub1');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className={`app ${mode}-mode`}>
      <AppBarHeader
        mode={mode}
        setMode={setMode}
        openSettings={() => setSettingsOpen(true)}
        openNotifications={() => setNotificationsOpen(true)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="app-mat-main-layout">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        {/*<SubSidebar
          isSidebarOpen={isSidebarOpen}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />*/}

        <SubSidebar
          isSidebarOpen={isSidebarOpen}
          selectedTab={selectedTab}   // ✅ NEW
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />


        <div className="app-mat-main-content-wrapper">
          <div className="app-mat-main-content">
            {/*<HeroSection />
            <Slideshow />
            <ContentSectionAlt viewMode={viewMode} setViewMode={setViewMode} />
            <WidgetsSection />
            <Footer />*/}
          

            <Outlet /> {/* 👈 this is where child routes render */}
          
          </div>

        </div>

        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      </div>
    </div>
  );
}

export default AppMaterial;

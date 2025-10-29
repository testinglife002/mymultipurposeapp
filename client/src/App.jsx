// src/App.jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import HomeGordius from "./pages/homegordius/HomeGordius";
import AdminRoutes from "./admin/AdminRoutes";
import UserDashboardLayout from "./user/UserDashboardLayout";
import AppsRoutes from "./apps/AppsRoutes";
import AuthorRoutes from "./author/AuthorRoutes";

import DesignRoutes from "./design/DesignRoutes";


import TaskManager from "./admin/components/TaskManager";
import ProjectManager from "./user/pages/ProjectManager";
import ProjectManagerAuthor from "./author/pages/ProjectManagerAuthor";
import ChannelManager from "./user/pages/ChannelManager";

import BannerMain from "./pages/banner/BannerMain";
import BannerMaker from "./pages/banner/BannerMaker";
import BannerMakerNew from "./pages/banner/BannerMakerNew";
import BannerMakerAlt from "./pages/banner/BannerMakerAlt";
import BannerMakerAdvanced from "./pages/banner/BannerMakerAdvanced";
import BannerMakerPage from "./pages/bannermaker/BannerMakerPage";
import TemplateManagerPage from "./pages/bannermaker/TemplateManagerPage";
import EditTemplatePage from "./pages/bannermaker/EditTemplatePage";

import TextApp from "./pages/textapp/TextApp";
import WhatsApp from "./pages/whatsapp/WhatsApp";
import WhatsAppSender from "./pages/whatsappmessage/WhatsAppSender";
import WhatsAppMessageSender from "./pages/whatsappmessage/WhatsAppMessageSender";

import TemplateEditor from "./pages/newsletter/TemplateEditor";
import EmailTemplateEditor from "./pages/newsletter/EmailTemplateEditor";
import NewsletterForm from "./pages/newsletter/NewsletterForm";
import TemplatesList from "./pages/newsletter/TemplatesList";

import Header from "./components/ui/Header";

import "./App.css";
import { requestNotificationPermission } from "./utils/requestNotificationPermission";
import { Toaster } from "react-hot-toast";
import BannerList from "./pages/banner/BannerList";
import BannerListPage from "./pages/banner/BannerListPage";

function AppWrapper() {
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Routes where header should NOT appear
  const noHeaderPaths = ["/login", "/register", "/verify-email"];
  const isAdminPath = location.pathname.startsWith("/admin");

  // Show header if NOT in noHeaderPaths AND not an admin path (Header visible in /admin/* too)
  const showHeader = !noHeaderPaths.includes(location.pathname);

  // Dynamic page padding based on header height
  const [headerHeight, setHeaderHeight] = useState(100);
  useEffect(() => {
    const updatePadding = () => {
      const headerEl = document.querySelector(".header-alt");
      setHeaderHeight(headerEl ? headerEl.offsetHeight : 100);
    };
    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [location.pathname]);

  // Auto wrap routes with PageWrapper if Header is visible
  const PageWrapper = ({ children }) =>
    showHeader ? (
      <div className="page-content" style={{ paddingTop: headerHeight }}>
        {children}
      </div>
    ) : (
      <>{children}</>
    );

  return (
    <>
      {showHeader && <Header user={user} setUser={setUser} />}
      <Toaster position="top-right" />
      <Routes>
        {/* Home */}
        <Route path="/" element={<PageWrapper><Home user={user} setUser={setUser} /></PageWrapper>} />

        {/* Public routes without Header */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Dashboard / Author / User / Apps / Designs / Admin */}
        <Route path="/dashboard/*" element={<PageWrapper><DashboardLayout user={user} /></PageWrapper>} />
        <Route path="/user/*" element={<PageWrapper><UserDashboardLayout user={user} /></PageWrapper>} />
        
        <Route path="/apps/*" element={<AppsRoutes user={user} />} />
        <Route path="/designs/*" element={<DesignRoutes user={user} />} />
        <Route path="/author/*" element={<AuthorRoutes user={user} />} />
        <Route path="/admin/*" element={<AdminRoutes user={user} />} />

        {/* Other routes with Header */}
        <Route path="/gordius" element={<PageWrapper><HomeGordius /></PageWrapper>} />
        
        <Route path="/task-manager" element={<PageWrapper><TaskManager /></PageWrapper>} />
        <Route path="/project-manager" element={<PageWrapper><ProjectManager user={user} /></PageWrapper>} />
        <Route path="/channel-manager" element={<PageWrapper><ChannelManager /></PageWrapper>} />
        <Route path="/author/project-manager" element={<PageWrapper><ProjectManagerAuthor /></PageWrapper>} />

        {/* Banner / Templates */}
        {/*<Route path="/banner-main" element={<PageWrapper><BannerMain /></PageWrapper>} />
        <Route path="/create-banner" element={<PageWrapper><BannerMaker /></PageWrapper>} />
        <Route path="/create-banner-alt" element={<PageWrapper><BannerMakerAlt /></PageWrapper>} />
        <Route path="/create-banner-ad" element={<PageWrapper><BannerMakerAdvanced /></PageWrapper>} />*/}
        
        <Route path="/banners" element={<PageWrapper><BannerListPage  /></PageWrapper>} />
        <Route path="/create-banner-new" element={<PageWrapper><BannerMakerNew /></PageWrapper>} />
        <Route path="/banner-maker" element={<PageWrapper><BannerMakerPage /></PageWrapper>} />
        <Route path="/banner-templates" element={<PageWrapper><TemplateManagerPage /></PageWrapper>} />
        <Route path="/edit-template/:id" element={<PageWrapper><EditTemplatePage /></PageWrapper>} />

        {/* Other Apps */}
        <Route path="/text-editor" element={<PageWrapper><TextApp /></PageWrapper>} />

        <Route path="/whatsapp/*" element={<PageWrapper><WhatsApp /></PageWrapper>} />
        <Route path="/whatsapp/sender" element={<PageWrapper><WhatsAppSender /></PageWrapper>} />
        <Route path="/whatsapp-sender" element={<PageWrapper><WhatsAppMessageSender /></PageWrapper>} />

        {/* Newsletter / Templates */}
        <Route path="/create-template" element={<PageWrapper><TemplateEditor /></PageWrapper>} />
        <Route path="/create-email-template" element={<PageWrapper><EmailTemplateEditor /></PageWrapper>} />
        <Route path="/send-newsletter" element={<PageWrapper><NewsletterForm /></PageWrapper>} />
        <Route path="/email-templates" element={<PageWrapper><TemplatesList /></PageWrapper>} />
        <Route path="/edit-email-template/:id" element={<PageWrapper><EmailTemplateEditor /></PageWrapper>} />
      
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}





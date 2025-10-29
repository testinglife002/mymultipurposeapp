// apps/layout/AppsLayout.jsx
import "../notes/notes.css";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppBarHeader from "../components/AppBarHeader";
import "../pages/AppMaterial.css";
import Sidebar from "../components/Sidebar";
import SubSidebar from "../components/SubSidebar";
import SettingsPanel from "../components/SettingsPanel";
import NotificationsPanel from "../components/NotificationsPanel";
import TodoSidebar from "../todos/layout/TodoSidebar";
import TaskSidebar from "../taskmanager/components/TaskSidebar";

export default function AppsLayout({ user }) {
  const [mode, setMode] = useState("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [selectedSubTab, setSelectedSubTab] = useState("sub1");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const location = useLocation();
  const isTodoApp = location.pathname.startsWith("/apps/todo");
  const isTaskManagerApp = location.pathname.startsWith("/apps/task-manager");

  return (
    <div className="app-container">
      <div className={`app ${mode}-mode`}>
        {/* ---------- App Header ---------- */}
        <header>
          <AppBarHeader
            mode={mode}
            setMode={setMode}
            openSettings={() => setSettingsOpen(true)}
            openNotifications={() => setNotificationsOpen(true)}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            user={user}
          />
        </header>

        {/* ---------- Main Layout ---------- */}
        <div className="app-mat-main-layout" style={{ marginLeft: "0" }}>
          {/* Main Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          {/* Conditional Sub Sidebar */}
          {isTodoApp ? (
            <TodoSidebar
              isExpanded={isSidebarOpen}
              toggleExpand={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          ) : isTaskManagerApp ? (
            <TaskSidebar
              expanded={isSidebarOpen}
              toggleExpand={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          ) : (
            <SubSidebar
              isSidebarOpen={isSidebarOpen}
              selectedTab={selectedTab}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
            />
          )}

          {/* Main Content */}
          <main className="app-main-outlet">
            <Outlet />
          </main>
        </div>

        {/* ---------- Panels ---------- */}
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <NotificationsPanel
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>
    </div>
  );
}



  
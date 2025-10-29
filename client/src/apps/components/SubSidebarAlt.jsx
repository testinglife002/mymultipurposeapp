// components/appmaterial/SubSidebarAlt.jsx
import React from "react";
import "./SubSidebarAlt.css";

const SubSidebarAlt = ({ isSidebarOpen, selectedSubTab, setSelectedSubTab }) => {
  return (
    <div className={`subsidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      <ul className="subsidebar-menu">
        <li
          className={selectedSubTab === "sub1" ? "active" : ""}
          onClick={() => setSelectedSubTab("sub1")}
        >
          Submenu 1
        </li>
        <li
          className={selectedSubTab === "sub2" ? "active" : ""}
          onClick={() => setSelectedSubTab("sub2")}
        >
          Submenu 2
        </li>
        <li
          className={selectedSubTab === "sub3" ? "active" : ""}
          onClick={() => setSelectedSubTab("sub3")}
        >
          Submenu 3
        </li>
      </ul>
    </div>
  );
};

export default SubSidebarAlt;

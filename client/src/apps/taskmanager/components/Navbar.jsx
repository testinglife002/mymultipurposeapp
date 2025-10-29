// apps/taskmanager/components/Navbar.jsx
import React from "react";
/// import { useDispatch, useSelector } from "react-redux";
// import { setOpenSidebar } from "../redux/slices/authSlice";
import NotificationPanel from "./NotificationPanel";
// import UserAvatar from "./UserAvatar";
import "./Navbar.css";

export default function Navbar() {
  // const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={() => dispatch(setOpenSidebar(true))}>
          ☰
        </button>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <NotificationPanel />
        {/*<UserAvatar user={user} />*/}
      </div>
    </header>
  );
}

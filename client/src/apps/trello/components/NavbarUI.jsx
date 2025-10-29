import React from "react";
import "./NavbarUI.css";

const NavbarUI = () => {
  return (
    <nav className="navbarui-trello-container">
      <div className="navbarui-trello-left">
        <span className="navbarui-trello-logo">MyBoard</span>
      </div>
      <div className="navbarui-trello-center">
        <ul className="navbarui-trello-menu">
          <li>Home</li>
          <li>Boards</li>
          <li>Projects</li>
          <li>Settings</li>
        </ul>
      </div>
      <div className="navbarui-trello-right">
        <span className="navbarui-trello-user">John Doe</span>
      </div>
    </nav>
  );
};

export default NavbarUI;

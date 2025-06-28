import React from "react";
import "./dashboard.css";
import logo from "../../assets/logo.png";

export default function SideBarMenu({ onSelect, activeItem }) {
  const menuItems = [
    "Students",
    "Attendance",
    "New Admissions",
    "Quizes",
    "Assignments",
    "Create Zoom Meeting",
    "Result",
  ];

  return (
    <div className="sideMenu">
      <div className="TopLogo">
        <img src={logo} alt="" />
        <h1>Khuddam Learning Online Classes</h1>
      </div>

      <ul className="barItems">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => onSelect(item)}
            className={activeItem === item ? "active" : ""}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink
          to="/admin/dashboard/addparticipant"
          className="sidebar-option"
        >
          <img src={assets.add_icon} alt="" />
          <p>Add Participant</p>
        </NavLink>
        <NavLink to="/admin/dashboard/listvoters" className="sidebar-option">
          <img src={assets.raise_hand} className="raise_hand-img" alt="" />
          <p>Voters</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

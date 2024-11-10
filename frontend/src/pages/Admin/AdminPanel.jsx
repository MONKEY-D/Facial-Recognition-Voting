import React from "react";
import "./AdminPanel.css";
import Sidebar from "../../components/Admin/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddParticipant from "./AddParticipant/AddParticipant";
import Voters from "./Voters/Voters";

const AdminPanel = () => {
  return (
    <div className="app-content">
      <Sidebar />
      <Routes>
        <Route path="/addparticipant" element={<AddParticipant />} />
        <Route path="/listvoters" element={<Voters />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;

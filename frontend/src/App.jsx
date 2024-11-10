import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/about";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import AdminPanel from "./pages/Admin/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/admin/dashboard/*" element={<AdminPanel />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

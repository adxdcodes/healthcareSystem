import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import UserDash from "./pages/UserDash";
import Chat from "./pages/Chat.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/sidebar" element={<Sidebar />}></Route>
          <Route path="/dashboard" element={<UserDash />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/complete-profile" element={<CompleteProfile />}></Route>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

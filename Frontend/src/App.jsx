import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [, setToken] = useState(null);
  const navigate = useNavigate();

  const clearAuth = () => {
    try{
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");

    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
    setUser(null);
    setToken(null);
  }

  const handleLogout=()=>{
    clearAuth();
    navigate("/login");

  }
  return (
    <>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

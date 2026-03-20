import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/RegisterPage.jsx";
import Login from "./pages/LoginPage.jsx";
import Users from "./pages/Users.jsx";

import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [setActiveForm] = useState('login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveForm('login'); 
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  );
}

export default App;

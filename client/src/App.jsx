import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/RegisterPage.jsx";
import Login from "./pages/LoginPage.jsx";
import Users from "./pages/Users.jsx";

import IncidentList from "./pages/IncidentList.jsx";
import CreateIncident from "./pages/CreateIncident.jsx";
import UpdateIncident from "./pages/UpdateIncident.jsx";

import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState('login'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveForm('login'); 
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />

        {!loading && (
          <>
            <Route path="/dashboard" element= {
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } />

            <Route path="/incidents" element= {
              <ProtectedRoute user={user}>
                <IncidentList />
              </ProtectedRoute>
            } />

            <Route path="/incidents/create" element={
              <ProtectedRoute user={user}>
                <CreateIncident user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="/incidents/:id/edit" element={
              <ProtectedRoute user={user}>
                <UpdateIncident />
              </ProtectedRoute>
            } />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;

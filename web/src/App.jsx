import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import TokenGeneration from './pages/TokenGeneration';
import QueueManagement from './pages/QueueManagement';
import AppointmentBooking from './pages/AppointmentBooking';
import DisplayBoard from './pages/DisplayBoard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getDashboard = () => {
    return <Dashboard user={user} onLogout={handleLogout} />;
  };

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
      <Route path="/display" element={<DisplayBoard />} />
      <Route path="/dashboard" element={user ? getDashboard() : <Navigate to="/login" />} />
      <Route path="/register-patient" element={user ? <PatientRegistration /> : <Navigate to="/login" />} />
      <Route path="/generate-token" element={user && user.role !== 'patient' ? <TokenGeneration /> : <Navigate to="/login" />} />
      <Route path="/queue" element={user && user.role !== 'patient' ? <QueueManagement /> : <Navigate to="/login" />} />
      <Route path="/appointments" element={user ? <AppointmentBooking /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;

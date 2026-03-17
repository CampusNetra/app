import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/admin/Login';
import Signup from './modules/admin/Signup';
import Dashboard from './modules/admin/Dashboard';
import TermsPage from './modules/admin/TermsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/terms" element={<TermsPage />} />
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

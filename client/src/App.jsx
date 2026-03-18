import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/admin/Login';
import Signup from './modules/admin/Signup';
import Dashboard from './modules/admin/Dashboard';
import TermsPage from './modules/admin/TermsPage';
import Welcome from './modules/admin/Welcome';
import Platform from './modules/legal/Platform';
import Resources from './modules/legal/Resources';
import Support from './modules/legal/Support';
import PrivacyPolicy from './modules/legal/PrivacyPolicy';
import TermsOfService from './modules/legal/TermsOfService';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/welcome" element={<Welcome />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/terms" element={<TermsPage />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

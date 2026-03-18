import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/admin/Login';
import Signup from './modules/admin/Signup';
import AdminLayout from './modules/admin/components/AdminLayout';
import Dashboard from './modules/admin/Dashboard';
import TermsPage from './modules/admin/TermsPage';
import StudentsManagement from './modules/admin/StudentsManagement';
import FacultyManagement from './modules/admin/FacultyManagement';
import FacultyAssignment from './modules/admin/FacultyAssignment';
import ChannelsManagement from './modules/admin/ChannelsManagement';
import DataImport from './modules/admin/DataImport';
import ModerationDashboard from './modules/admin/ModerationDashboard';
import SystemAnalytics from './modules/admin/SystemAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/students" element={<StudentsManagement />} />
          <Route path="/admin/faculty" element={<FacultyManagement />} />
          <Route path="/admin/faculty-assignments" element={<FacultyAssignment />} />
          <Route path="/admin/channels" element={<ChannelsManagement />} />
          <Route path="/admin/data-import" element={<DataImport />} />
          <Route path="/admin/moderation" element={<ModerationDashboard />} />
          <Route path="/admin/analytics" element={<SystemAnalytics />} />
          <Route path="/admin/terms" element={<TermsPage />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

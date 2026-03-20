import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/admin/Login';
import Signup from './modules/admin/Signup';
import AdminLayout from './modules/admin/components/AdminLayout';
import Dashboard from './modules/admin/Dashboard';
import TermsPage from './modules/admin/TermsPage';
import Welcome from './modules/admin/Welcome';
import Platform from './modules/legal/Platform';
import Resources from './modules/legal/Resources';
import Support from './modules/legal/Support';
import PrivacyPolicy from './modules/legal/PrivacyPolicy';
import TermsOfService from './modules/legal/TermsOfService';
import StudentsManagement from './modules/admin/StudentsManagement';
import FacultyManagement from './modules/admin/FacultyManagement';
import BranchesManagement from './modules/admin/BranchesManagement';
import SectionsManagement from './modules/admin/SectionsManagement';
import SubjectsManagement from './modules/admin/SubjectsManagement';
import FacultyAssignment from './modules/admin/FacultyAssignment';
import ChannelsManagement from './modules/admin/ChannelsManagement';
import ClubsManagement from './modules/admin/ClubsManagement';
import DataImport from './modules/admin/DataImport';
import ModerationDashboard from './modules/admin/ModerationDashboard';
import SystemAnalytics from './modules/admin/SystemAnalytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/welcome" element={<Welcome />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/admin/students" element={<StudentsManagement />} />
          <Route path="/admin/faculty" element={<FacultyManagement />} />
          <Route path="/admin/branches" element={<BranchesManagement />} />
          <Route path="/admin/sections" element={<SectionsManagement />} />
          <Route path="/admin/subjects" element={<SubjectsManagement />} />
          <Route path="/admin/faculty-assignments" element={<FacultyAssignment />} />
          <Route path="/admin/channels" element={<ChannelsManagement />} />
          <Route path="/admin/clubs" element={<ClubsManagement />} />
          <Route path="/admin/data-import" element={<DataImport />} />
          <Route path="/admin/moderation" element={<ModerationDashboard />} />
          <Route path="/admin/analytics" element={<SystemAnalytics />} />
          <Route path="/admin/terms" element={<TermsPage />} />
        </Route>
        
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

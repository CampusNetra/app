import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './modules/admin/Login';
import Signup from './modules/admin/Signup';
import AdminLayout from './modules/admin/components/AdminLayout';
import Dashboard from './modules/admin/Dashboard';
import TermsPage from './modules/admin/TermsPage';
import Welcome from './modules/admin/Welcome';
import StudentWelcome from './modules/student/StudentWelcome';
import StudentSignup from './modules/student/StudentSignup';
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
import ChatSystem from './modules/admin/chat/ChatSystem';
import LandingPage from './modules/common/LandingPage';
import StudentSplash from './modules/student/StudentSplash';
import StudentOTP from './modules/student/StudentOTP';
import StudentFeed from './modules/student/StudentFeed';
import StudentAlertsPage from './modules/student/StudentAlertsPage';
import StudentAnnouncementsPage from './modules/student/StudentAnnouncementsPage';
import StudentClubsPage from './modules/student/StudentClubsPage';
import StudentMarketplacePage from './modules/student/StudentMarketplacePage';
import StudentEventsPage from './modules/student/StudentEventsPage';
import StudentChatPage from './modules/student/StudentChatPage';
import StudentProfilePage from './modules/student/StudentProfilePage';
import StudentEventDetailsPage from './modules/student/StudentEventDetailsPage';
import FacultyWelcome from './modules/faculty/FacultyWelcome';
import FacultySignup from './modules/faculty/FacultySignup';
import FacultyDashboard from './modules/faculty/FacultyDashboard';
import FacultyNewAnnouncement from './modules/faculty/FacultyNewAnnouncement';
import FacultyCreateAssignment from './modules/faculty/FacultyCreateAssignment';
import FacultyAssignments from './modules/faculty/FacultyAssignments';
import FacultyAnnouncements from './modules/faculty/FacultyAnnouncements';
import FacultyPolls from './modules/faculty/FacultyPolls';
import FacultyCreatePoll from './modules/faculty/FacultyCreatePoll';
import FacultyMaterials from './modules/faculty/FacultyMaterials';
import FacultyUploadMaterial from './modules/faculty/FacultyUploadMaterial';
import FacultySubjects from './modules/faculty/FacultySubjects';
import FacultyMessages from './modules/faculty/FacultyMessages';
import FacultyChatWindow from './modules/faculty/FacultyChatWindow';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/faculty/login" element={<FacultyWelcome />} />
        <Route path="/faculty/signup" element={<FacultySignup />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/announcements" element={<FacultyAnnouncements />} />
        <Route path="/faculty/announcements/new" element={<FacultyNewAnnouncement />} />
        <Route path="/faculty/assignments" element={<FacultyAssignments />} />
        <Route path="/faculty/assignments/new" element={<FacultyCreateAssignment />} />
        <Route path="/faculty/polls" element={<FacultyPolls />} />
        <Route path="/faculty/polls/new" element={<FacultyCreatePoll />} />
        <Route path="/faculty/materials" element={<FacultyMaterials />} />
        <Route path="/faculty/materials/new" element={<FacultyUploadMaterial />} />
        <Route path="/faculty/subjects" element={<FacultySubjects />} />
        <Route path="/faculty/messages" element={<FacultyMessages />} />
        <Route path="/faculty/messages/:channelId" element={<FacultyChatWindow />} />
        <Route path="/student/splash" element={<StudentSplash />} />
        <Route path="/student/welcome" element={<StudentWelcome />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/verify" element={<StudentOTP />} />
        <Route path="/student/feed" element={<StudentFeed />} />
        <Route path="/student/alerts" element={<StudentAlertsPage />} />
        <Route path="/student/announcements" element={<StudentAnnouncementsPage />} />
        <Route path="/student/clubs" element={<StudentClubsPage />} />
        <Route path="/student/marketplace" element={<StudentMarketplacePage />} />
        <Route path="/student/events" element={<StudentEventsPage />} />
        <Route path="/student/events/:eventId" element={<StudentEventDetailsPage />} />
        <Route path="/student/chat" element={<StudentChatPage />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student" element={<Navigate to="/student/welcome" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/welcome" element={<Welcome />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/students" element={<StudentsManagement />} />
            <Route path="/admin/faculty" element={<FacultyManagement />} />
            <Route path="/admin/branches" element={<BranchesManagement />} />
            <Route path="/admin/sections" element={<SectionsManagement />} />
            <Route path="/admin/subjects" element={<SubjectsManagement />} />
            <Route path="/admin/faculty-assignments" element={<FacultyAssignment />} />
            <Route path="/admin/chat" element={<ChatSystem />} />
            <Route path="/admin/channels" element={<ChannelsManagement />} />
            <Route path="/admin/clubs" element={<ClubsManagement />} />
            <Route path="/admin/data-import" element={<DataImport />} />
            <Route path="/admin/moderation" element={<ModerationDashboard />} />
            <Route path="/admin/analytics" element={<SystemAnalytics />} />
            <Route path="/admin/terms" element={<TermsPage />} />
          </Route>
        </Route>
        
        <Route path="/platform" element={<Platform />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

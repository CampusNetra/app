import React from 'react';
import StudentBlankPage from './StudentBlankPage';

const StudentAnnouncementsPage = () => (
  <StudentBlankPage
    title="Announcements"
    type="announcements"
    heading="Official Notices"
    message="Check here for formal university and department updates."
    actionLabel="Reload Feed"
    dockActive="feed"
  />
);

export default StudentAnnouncementsPage;

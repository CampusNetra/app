import React from 'react';
import StudentBlankPage from './StudentBlankPage';

const StudentProfilePage = () => (
  <StudentBlankPage
    title="Profile"
    type="profile"
    heading="My Campus Profile"
    message="Manage your academic info and personal settings."
    actionLabel="Edit Settings"
    dockActive="profile"
  />
);

export default StudentProfilePage;

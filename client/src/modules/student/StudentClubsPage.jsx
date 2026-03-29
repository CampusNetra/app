import React from 'react';
import StudentBlankPage from './StudentBlankPage';

const StudentClubsPage = () => (
  <StudentBlankPage
    title="Clubs"
    type="clubs"
    heading="Explore Community"
    message="Join clubs and discover events tailored for you."
    actionLabel="Join a Club"
    dockActive="feed"
  />
);

export default StudentClubsPage;

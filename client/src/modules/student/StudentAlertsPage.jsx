import React from 'react';
import StudentBlankPage from './StudentBlankPage';

const StudentAlertsPage = () => (
  <StudentBlankPage
    title="Alerts"
    type="alerts"
    heading="Stay Notified"
    message="You're all caught up! High priority alerts will appear here."
    actionLabel="Refresh Notifications"
    dockActive="chat"
  />
);

export default StudentAlertsPage;

import React from 'react';
import StudentBlankPage from './StudentBlankPage';

const StudentChatPage = () => (
  <StudentBlankPage
    title="Chat"
    type="chat"
    heading="Messages"
    message="No recent conversations. Start a chat with friends or faculty."
    actionLabel="New Message"
    dockActive="chat"
  />
);

export default StudentChatPage;

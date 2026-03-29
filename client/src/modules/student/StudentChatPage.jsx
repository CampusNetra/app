import React, { useState, useEffect } from 'react';
import ChatList from './chat/ChatList';
import ChatWindow from './chat/ChatWindow';
import StudentDock from './StudentDock';
import './chat/chat-student.css';

const StudentChatPage = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'window'

  const handleOpenChannel = (channel) => {
    setActiveChannel(channel);
    setView('window');
  };

  const handleBack = () => {
    setView('list');
    setActiveChannel(null);
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2 p-0 overflow-hidden relative">
        {view === 'list' ? (
          <ChatList onSelectChannel={handleOpenChannel} />
        ) : (
          <ChatWindow channel={activeChannel} onBack={handleBack} />
        )}
        
        {view === 'list' && <StudentDock active="chat" />}
      </div>
    </div>
  );
};

export default StudentChatPage;

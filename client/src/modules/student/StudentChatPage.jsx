import React, { useEffect, useState } from 'react';
import ChatList from './chat/ChatList';
import ChatWindow from './chat/ChatWindow';
import api from '../../api';
import StudentDock from './StudentDock';
import './chat/chat-student.css';

const StudentChatPage = () => {
  const [view, setView] = useState('list');
  const [activeChannel, setActiveChannel] = useState(null);
  const [loadingWindow, setLoadingWindow] = useState(false);

  const fallbackChannel = {
    id: 0,
    name: 'Campus Chat',
    member_count: 0,
    can_student_post_top_level: true,
    can_student_reply_in_threads: true,
    is_department_broadcast: false
  };

  const handleOpenChannel = async (channel) => {
    if (channel) {
      setActiveChannel(channel);
      setView('window');
      return;
    }

    try {
      setLoadingWindow(true);
      const response = await api.get('/student/chat/channels');
      const first = Array.isArray(response?.data) ? response.data[0] : null;
      setActiveChannel(first || fallbackChannel);
      setView('window');
    } catch (error) {
      setActiveChannel(fallbackChannel);
      setView('window');
    } finally {
      setLoadingWindow(false);
    }
  };

  const handleBackToList = () => {
    setView('list');
    setActiveChannel(null);
  };

  const studentUser = JSON.parse(sessionStorage.getItem('student_user') || '{}');

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2 p-0 overflow-hidden relative">
        {view === 'list' ? (
          <>
            <ChatList onSelectChannel={handleOpenChannel} />
            <StudentDock active="chat" />
          </>
        ) : loadingWindow || !activeChannel ? (
          <div className="st-chat-state">Loading chat...</div>
        ) : (
          <ChatWindow 
            channel={activeChannel} 
            user={studentUser} 
            onBack={handleBackToList} 
          />
        )}
      </div>
    </div>
  );
};

export default StudentChatPage;

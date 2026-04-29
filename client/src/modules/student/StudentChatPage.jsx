import React, { useState, useEffect } from 'react';
import ChatList from './chat/ChatList';
import ChatWindow from './chat/ChatWindow';
import api from '../../api';
import './chat/chat-student.css';

const StudentChatPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'window' (only for mobile)
  const [activeChannel, setActiveChannel] = useState(null);
  const [loadingWindow, setLoadingWindow] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      if (!isDesktop) setView('window');
      return;
    }

    try {
      setLoadingWindow(true);
      const response = await api.get('/student/chat/channels');
      const first = Array.isArray(response?.data) ? response.data[0] : null;
      setActiveChannel(first || fallbackChannel);
      if (!isDesktop) setView('window');
    } catch (error) {
      setActiveChannel(fallbackChannel);
      if (!isDesktop) setView('window');
    } finally {
      setLoadingWindow(false);
    }
  };

  const handleBackToList = () => {
    setView('list');
    if (!isDesktop) setActiveChannel(null);
  };

  const studentUser = JSON.parse(localStorage.getItem('student_user') || '{}');

  // Desktop side-by-side view
  if (isDesktop) {
    return (
      <div className="st-chat-desktop-container">
        <div className="st-chat-sidebar-pane">
          <ChatList 
            onSelectChannel={handleOpenChannel} 
            currentUserId={studentUser?.id} 
            BottomNavComponent={() => null} 
          />
        </div>
        <div className="st-chat-main-pane">
           {!activeChannel && !loadingWindow ? (
             <div className="st-chat-empty-selection">
                <div className="empty-icon shadow-sm">
                   <img src="/logo192.png" alt="Logo" style={{ width: 40, opacity: 0.2 }} />
                </div>
                <h3>Your Conversations</h3>
                <p>Select a group from the list to start connecting with your campus.</p>
             </div>
           ) : loadingWindow ? (
             <div className="st-chat-state">Loading conversation...</div>
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
  }

  // Mobile View
  return (
    <div className="st-mobile-frame feed-v2 p-0 overflow-hidden relative">
      {view === 'list' ? (
        <ChatList onSelectChannel={handleOpenChannel} currentUserId={studentUser?.id} />
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
  );
};

export default StudentChatPage;

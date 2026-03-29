import React, { useState, useEffect } from 'react';
import { Search, PenSquare, Bell, Users, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import api from '../../../api';

const ChatList = ({ onSelectChannel }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await api.get('/student/chat/channels');
        setChannels(response?.data || []);
      } catch (err) {
        console.error('Failed to load channels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  const categorized = {
    branch: channels.filter(c => c.type === 'branch'),
    section: channels.filter(c => c.type === 'section'),
    subject: channels.filter(c => c.type === 'subject')
  };

  const renderSection = (title, items, icon) => {
    if (items.length === 0) return null;
    return (
      <div className="st-chat-sec">
        <div className="st-chat-section-label flex items-center gap-2">
           {icon} {title}
        </div>
        {items.map(channel => (
          <div 
            key={channel.id} 
            className="st-chat-item cursor-pointer" 
            onClick={() => onSelectChannel(channel)}
          >
            <div className="st-chat-avatar">
               <div className="bg-slate-50 w-full h-full flex items-center justify-center text-slate-400">
                  <Users size={24} />
               </div>
               {channel.type === 'branch' && <div className="st-status-dot"></div>}
            </div>
            <div className="st-chat-info">
              <div className="st-chat-info-top">
                <h3>{channel.name}</h3>
                <span className="st-chat-time">
                  {channel.last_message_time ? new Date(channel.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <div className="st-chat-preview">
                 <p>{channel.last_sender ? `${channel.last_sender.split(' ')[0]}: ${channel.last_message}` : 'No messages yet'}</p>
                 {channel.unread_count > 0 && <div className="st-chat-unread">{channel.unread_count}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="st-chat-shell">
      <header className="st-chat-header">
        <div className="st-chat-title-row">
           <h1>Chats</h1>
           <button className="text-slate-600"><PenSquare size={22} /></button>
        </div>
        <div className="st-chat-search">
           <Search size={18} className="text-slate-400" />
           <input 
             type="text" 
             placeholder="Search messages or groups" 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar-hide">
        {loading ? (
          <div className="p-10 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">
             Synchronizing groups...
          </div>
        ) : (
          <>
            {renderSection('Branch Groups', categorized.branch, <GraduationCap size={14} />)}
            {renderSection('Section Groups', categorized.section, <Bell size={14} />)}
            {renderSection('Subject Groups', categorized.subject, <BookOpen size={14} />)}
            
            {channels.length === 0 && (
              <div className="p-20 text-center text-slate-400">
                 <p className="font-bold text-sm">No communities found.</p>
                 <p className="text-xs mt-1">Check back later for group assignments.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatList;

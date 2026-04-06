import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MoreVertical, Send, Smile, Plus, Info, Megaphone, ThumbsUp, Reply, Bell } from 'lucide-react';
import api from '../../../api';
import { io } from 'socket.io-client';

const resolveSocketUrl = () => {
  const configuredApi = import.meta.env.VITE_API_URL;
  if (configuredApi && /^https?:\/\//.test(configuredApi)) {
    return configuredApi.replace(/\/api\/?$/, '');
  }
  // Robust fallback for local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
};

const ChatWindow = ({ channel, user, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadInput, setThreadInput] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [channelDetails, setChannelDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showMoreMenuId, setShowMoreMenuId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  
  const scrollRef = useRef(null);
  const threadScrollRef = useRef(null);
  const socketRef = useRef(null);
  const activeChannelRef = useRef(null);
  const activeThreadRef = useRef(null);

  useEffect(() => {
    activeChannelRef.current = channel;
  }, [channel]);

  useEffect(() => {
    activeThreadRef.current = activeThread;
  }, [activeThread]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const ensureSocketConnected = () => {
    if (socketRef.current) return socketRef.current;

    const token = localStorage.getItem('student_token') || localStorage.getItem('token');
    if (!token) return null;

    const socket = io(resolveSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000
    });

    socket.on('connect', () => {
      setSocketConnected(true);
      const currentChannelId = activeChannelRef.current?.id;
      if (currentChannelId) {
        socket.emit('chat:join-channel', { channelId: currentChannelId });
      }
    });

    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('connect_error', () => setSocketConnected(false));

    socket.on('chat:new-message', (incomingMessage) => {
      if (!incomingMessage?.id) return;

      const currentChannelId = activeChannelRef.current?.id;
      if (Number(incomingMessage.channel_id) === Number(currentChannelId)) {
        if (incomingMessage.parent_id) {
          // If it's a reply and matches the active thread
          if (Number(activeThreadRef.current?.id) === Number(incomingMessage.parent_id)) {
            setThreadReplies((prev) => {
              if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
              return [...prev, incomingMessage];
            });
          }

          // Also increment reply count in top-level list
          setMessages((prev) => prev.map((msg) => {
            if (Number(msg.id) !== Number(incomingMessage.parent_id)) return msg;
            return { ...msg, reply_count: Number(msg.reply_count || 0) + 1 };
          }));
        } else {
          // It's a top-level message
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
            return [...prev, incomingMessage];
          });
        }
      }
    });

    socket.on('user:presence', ({ userId, is_online, last_seen }) => {
      setChannelDetails((prev) => {
        if (!prev || !prev.members) return prev;
        return {
          ...prev,
          members: prev.members.map(m => 
            Number(m.id) === Number(userId) 
              ? { ...m, is_online, last_seen: last_seen || new Date() } 
              : m
          )
        };
      });
    });

    socket.on('chat:message-edited', (editedMessage) => {
      const updateList = (list) => list.map(m => m.id === editedMessage.id ? { ...m, ...editedMessage } : m);
      setMessages(prev => updateList(prev));
      setThreadReplies(prev => updateList(prev));
      setActiveThread(prev => prev && prev.id === editedMessage.id ? { ...prev, ...editedMessage } : prev);
    });

    socket.on('chat:message-deleted', ({ id }) => {
      const removeList = (list) => list.filter(m => m.id !== id);
      setMessages(prev => removeList(prev));
      setThreadReplies(prev => removeList(prev));
      if (activeThreadRef.current?.id === id) {
        setActiveThread(null);
        setThreadReplies([]);
      }
    });

    socketRef.current = socket;
    return socket;
  };

  useEffect(() => {
    if (channel?.id) {
      loadMessages();
      const socket = ensureSocketConnected();
      if (socket) {
        socket.emit('chat:join-channel', { channelId: channel.id });
      }
      
      return () => {
        if (socket) {
          socket.emit('chat:leave-channel', { channelId: channel.id });
        }
      };
    }
  }, [channel?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (threadScrollRef.current) {
      threadScrollRef.current.scrollTop = threadScrollRef.current.scrollHeight;
    }
  }, [threadReplies]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/student/chat/channels/${channel.id}/messages`);
      setMessages(response?.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const openThread = async (message) => {
    try {
      setActiveThread(message);
      setThreadLoading(true);
      const response = await api.get(`/student/chat/messages/${message.id}/replies`);
      setThreadReplies(response?.data || []);
    } catch (err) {
      console.error('Failed to load replies:', err);
    } finally {
      setThreadLoading(false);
    }
  };

  const closeThread = () => {
    setActiveThread(null);
    setThreadReplies([]);
    setThreadInput('');
  };

  const fetchDetails = async () => {
    try {
      setDetailsLoading(true);
      setShowInfo(true);
      const res = await api.get(`/student/chat/channels/${channel.id}`);
      setChannelDetails(res.data);
    } catch (err) {
      console.error('Failed to fetch details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    try {
      const response = await api.post(`/student/chat/channels/${channel.id}/messages`, {
        content: inputValue,
        type: 'text'
      });
      setInputValue('');
      // The socket will handle adding the message to the view
      // But we can also add it manually for immediate feedback
      const newMessage = response?.data;
      if (newMessage) {
        setMessages(prev => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/student/chat/messages/${messageId}`);
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditSubmit = async (messageId) => {
    if (!editValue.trim()) return;
    try {
      await api.put(`/student/chat/messages/${messageId}`, { content: editValue });
      setEditingMessageId(null);
      setEditValue('');
      // Socket will handle update
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const handleThreadSend = async () => {
    if (!threadInput.trim() || !activeThread) return;
    try {
      const response = await api.post(`/student/chat/channels/${channel.id}/messages`, {
        content: threadInput,
        type: 'text',
        parent_id: activeThread.id
      });
      setThreadInput('');
      
      const newReply = response?.data;
      if (newReply) {
        setThreadReplies(prev => {
          if (prev.some(r => r.id === newReply.id)) return prev;
          return [...prev, newReply];
        });
        
        // Manual increment of reply count
        setMessages(prev => prev.map(m => {
          if (Number(m.id) === Number(activeThread.id)) {
            return { ...m, reply_count: Number(m.reply_count || 0) + 1 };
          }
          return m;
        }));
      }
    } catch (err) {
      console.error('Reply failed:', err);
    }
  };

  const filteredMessages = isSearching 
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()) || m.sender_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const renderMessageCard = (msg) => {
    const isAnnouncement = msg.type === 'announcement' || msg.sender_role === 'faculty' || msg.sender_role === 'admin';
    const canReply = isAnnouncement || Number(msg.reply_count || 0) > 0;
    const isOwn = Number(msg.sender_id) === Number(user?.id);
    
    // Normalize role for badge display
    const isSystemAdmin = msg.sender_role === 'dept_admin' || msg.sender_role === 'super_admin' || msg.sender_role === 'admin';
    const isFaculty = msg.sender_role === 'faculty';
    const normalizedRole = isSystemAdmin ? 'admin' : (isFaculty ? 'faculty' : 'student');

    const roleColors = {
      admin: 'bg-orange-500 text-white',
      faculty: 'bg-blue-600 text-white',
      student: 'bg-slate-100 text-slate-500'
    };
    const roleDisplay = {
      admin: 'Admin',
      faculty: 'Faculty',
      student: 'Student'
    };

    return (
      <div key={msg.id} className={`st-msg-wrap animate-fade ${isOwn ? 'own' : ''}`}>
        {!isOwn && (
          <div className="st-msg-avatar">
            {getInitials(msg.sender_name)}
          </div>
        )}
        <div className="st-msg-main">
          {!isOwn && (
            <div className="st-msg-sender flex items-center gap-2 mb-1.5 px-1">
              <span className="st-sender-name font-bold text-slate-700 text-sm">{msg.sender_name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${roleColors[normalizedRole]}`}>
                {roleDisplay[normalizedRole]}
              </span>
            </div>
          )}
          <div 
            className={`st-msg-bubble ${isAnnouncement ? 'announcement' : ''} ${isOwn ? 'own' : ''}`}
            onClick={() => canReply && openThread(msg)}
            style={{ cursor: canReply ? 'pointer' : 'default' }}
          >
            {isAnnouncement && (
              <div className="st-card-tag" style={{ color: isOwn ? 'white' : '#ff6129', fontSize: '10px', fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Megaphone size={12} fill="currentColor" /> IMPORTANT
              </div>
            )}
            
            {editingMessageId === msg.id ? (
              <div className="flex flex-col gap-2">
                <textarea 
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 text-sm outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingMessageId(null)} className="text-[10px] font-bold text-white/70">CANCEL</button>
                  <button onClick={() => handleEditSubmit(msg.id)} className="text-[10px] font-bold text-white bg-white/20 px-2 py-1 rounded">SAVE</button>
                </div>
              </div>
            ) : (
              <div className="st-msg-text">
                {msg.content}
                {msg.is_edited ? <span className="text-[10px] opacity-40 ml-2">(edited)</span> : null}
              </div>
            )}

            <div className="st-msg-footer">
              <span className="st-msg-time-internal">{formatTime(msg.created_at)}</span>
            </div>
          </div>
          <div className="st-card-actions flex flex-row items-center gap-3">
            <button className="st-action-btn flex items-center gap-1" onClick={() => openThread(msg)}>
              <Reply size={14} /> REPLY
            </button>
            {isOwn && (
               <div className="relative">
                  <button 
                    className="st-action-btn p-1 -m-1" 
                    onClick={(e) => { e.stopPropagation(); setShowMoreMenuId(showMoreMenuId === msg.id ? null : msg.id); }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {showMoreMenuId === msg.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 z-[1000] animate-fade min-w-[140px]">
                      <button 
                        className="w-full px-5 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        onClick={() => { setEditingMessageId(msg.id); setEditValue(msg.content); setShowMoreMenuId(null); }}
                      >
                         Edit Signal
                      </button>
                      <button 
                        className="w-full px-5 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => { setConfirmDeleteId(msg.id); setShowMoreMenuId(null); }}
                      >
                         Delete
                      </button>
                    </div>
                  )}
               </div>
            )}
            {Number(msg.reply_count || 0) > 0 && (
              <button className="st-action-btn" style={{ color: '#94a3b8' }} onClick={() => openThread(msg)}>
                <Smile size={14} /> {msg.reply_count}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="st-chat-window animate-fade">
      {!activeThread && !showInfo ? (
        <div className="st-chat-shell">
          <header className={`st-win-header-v2 ${isSearching ? 'searching' : ''}`}>
            {!isSearching ? (
              <>
                <button onClick={onBack} className="st-icon-btn">
                  <ArrowLeft size={24} />
                </button>
                <div className="st-win-info">
                  <h1>{channel.name}</h1>
                  <p>{(channelDetails?.members?.length || channel.member_count || 0)} participants</p>
                </div>
                <div className="flex gap-4">
                  <button className="st-icon-btn" onClick={() => setIsSearching(true)}>
                    <Search size={22} />
                  </button>
                  <button className="st-icon-btn" onClick={fetchDetails}>
                    <Info size={22} />
                  </button>
                </div>
              </>
            ) : (
              <div className="st-header-search-box">
                <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="st-icon-btn">
                  <ArrowLeft size={22} />
                </button>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search in chat..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </header>

          <div className="st-chat-messages custom-scrollbar" ref={scrollRef}>
            {loading ? (
              <div className="p-20 text-center"><div className="w-8 h-8 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mx-auto"></div></div>
            ) : (
              <>
                {filteredMessages.length > 0 ? (
                  <>
                    {!isSearching && <div className="st-date-separator"><div className="st-date-pill">TODAY</div></div>}
                    {filteredMessages.map(renderMessageCard)}
                  </>
                ) : (
                  <div className="p-20 text-center text-slate-400">
                    {isSearching ? 'No results found for your search.' : 'No signals found here yet.'}
                  </div>
                )}
              </>
            )}
          </div>

          {channel.can_student_post_top_level ? (
            <div className="st-chat-input-bar">
              <button className="st-icon-btn text-slate-400"><Plus size={26} /></button>
              <div className="st-input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Smile size={22} className="text-slate-400" />
              </div>
              <button className="st-send-btn shadow-lg" onClick={handleSend}><Send size={24} fill="currentColor" /></button>
            </div>
          ) : null}
        </div>
      ) : showInfo ? (
        <div className="st-info-page animate-fade flex flex-col h-full bg-white">
          <header className="st-win-header-v2 border-none">
            <button onClick={() => setShowInfo(false)} className="st-icon-btn">
              <ArrowLeft size={24} />
            </button>
            <div className="st-win-info">
              <h1>Group Info</h1>
            </div>
            <button className="st-icon-btn"><MoreVertical size={24} /></button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="st-info-hero">
              <div className="st-hero-avatar-wrap relative">
                <div className="st-hero-avatar">
                   {getInitials(channel.name)}
                </div>
                {/* Image shows camera icon in mockup, keeping for polish but student won't edit it */}
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-orange-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                  <Smile size={16} fill="currentColor" />
                </div>
              </div>
              
              <h2 className="st-hero-name">{channel.name}</h2>
              <p className="st-hero-stats">
                 {channelDetails?.members?.length || 0} Members · {channelDetails?.members?.filter(m => m.role === 'admin' || m.channel_role === 'admin' || m.channel_role === 'owner').length || 0} Admins
              </p>
            </div>

            {/* Content Body */}
            <div className="st-info-content px-5 pb-24">
                {/* Admins Section */}
                <div className="st-info-section">
                   <div className="st-info-section-header">
                     <span>ADMINS</span>
                  </div>
                  <div className="st-info-list">
                     {channelDetails?.members?.filter(m => 
                        m.role === 'dept_admin' || m.role === 'super_admin'
                     ).map(m => (
                       <div key={m.id} className="st-info-member-item">
                         <div className="st-member-avatar relative bg-orange-500 text-white text-sm">
                           {getInitials(m.name)}
                           {!!m.is_online ? <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span> : null}
                         </div>
                         <div className="st-member-info">
                            <div className="st-member-name flex items-center gap-2">
                               {m.name}
                               <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-[9px] font-bold uppercase tracking-tight">Admin</span>
                            </div>
                            <div className="st-member-role">
                              {!!m.is_online ? <span className="text-green-600 font-bold">Online Now</span> : (m.channel_role === 'owner' ? 'Channel Creator' : 'Group Manager')}
                            </div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>

                {/* Faculty Section */}
                <div className="st-info-section mt-6">
                   <div className="st-info-section-header">
                     <span>FACULTY</span>
                  </div>
                  <div className="st-info-list">
                     {channelDetails?.members?.filter(m => 
                        m.role === 'faculty'
                     ).map(m => (
                       <div key={m.id} className="st-info-member-item">
                         <div className="st-member-avatar relative bg-slate-100 text-slate-500 text-sm">
                           {getInitials(m.name)}
                           {!!m.is_online ? <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span> : null}
                         </div>
                         <div className="st-member-info">
                            <div className="st-member-name flex items-center gap-2">
                               {m.name}
                            </div>
                            <div className="st-member-role">
                              {!!m.is_online ? <span className="text-green-600 font-bold">Online Now</span> : 'Faculty Member'}
                            </div>
                         </div>
                       </div>
                     ))}
                     {channelDetails?.members?.filter(m => m.role === 'faculty').length === 0 && (
                       <p className="text-slate-400 text-[12px] py-1">No faculty members found</p>
                     )}
                  </div>
                </div>

               {/* Students Section */}
               <div className="st-info-section mt-8">
                  <div className="st-info-section-header">
                     <span>STUDENTS</span>
                     <button className="text-orange-500 font-bold ml-auto text-[13px]" onClick={() => setIsSearchingMembers(!isSearchingMembers)}>
                        {isSearchingMembers ? 'Cancel' : 'Search'}
                     </button>
                  </div>
                  {isSearchingMembers && (
                    <div className="mt-4 mb-2 animate-fade">
                      <input 
                        type="text" 
                        placeholder="Search for a student..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-orange-200 transition-all duration-300 shadow-inner"
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                  <div className="st-info-list">
                     {channelDetails?.members
                        ?.filter(m => m.role === 'student' && m.channel_role === 'member')
                        .filter(m => !memberSearchQuery || m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                        .slice(0, showAllStudents || isSearchingMembers ? 999 : 5)
                        .map(m => (
                       <div key={m.id} className="st-info-member-item">
                         <div className="st-member-avatar relative bg-slate-100 text-slate-400 text-sm">
                           {getInitials(m.name)}
                           {!!m.is_online ? <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span> : null}
                         </div>
                         <div className="st-member-name flex-1 flex flex-col">
                           <span>{m.name}</span>
                           {!!m.is_online ? (
                              <span className="text-[10px] text-green-500 font-bold">Active Now</span>
                           ) : (
                              m.last_seen ? (
                                <span className="text-[10px] text-slate-400 font-medium">Last seen: {formatTime(m.last_seen)}</span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium">Offline</span>
                              )
                           )}
                         </div>
                       </div>
                     ))}
                     {channelDetails?.members?.filter(m => m.role === 'student' && m.channel_role === 'member').length > 5 && !showAllStudents && !isSearchingMembers && (
                        <button 
                           onClick={() => setShowAllStudents(true)}
                           className="w-full py-4 text-slate-400 text-sm font-bold flex items-center justify-center gap-2"
                        >
                           <Plus size={16} /> Show {channelDetails.members.filter(m => m.role === 'student').length - 5} more members
                        </button>
                     )}
                     {channelDetails?.members?.filter(m => m.role === 'student').length === 0 && (
                       <p className="text-slate-400 text-sm py-2">No students found</p>
                     )}
                  </div>
               </div>

               {/* Settings Section */}
               <div className="st-info-settings mt-8 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-4 p-4 border-b border-slate-50">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                        <Bell size={20} />
                     </div>
                     <div className="flex-1">
                        <div className="font-bold text-slate-700">Mute Notifications</div>
                        <div className="text-[10px] text-slate-400 font-medium">Turn off all message alerts</div>
                     </div>
                     <div 
                        className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isMuted ? 'bg-orange-500' : 'bg-slate-200'}`}
                        onClick={() => setIsMuted(!isMuted)}
                     >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? 'translate-x-4' : 'translate-x-0'}`}></div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                        <Info size={20} />
                     </div>
                     <span className="flex-1 font-bold text-slate-700">Report Group</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="st-thread-page animate-fade">
          <header className="st-win-header-v2">
            <button onClick={closeThread} className="st-icon-btn">
              <ArrowLeft size={24} />
            </button>
            <div className="st-win-info">
              <h1>Thread Discussion</h1>
              <p>{threadReplies.length} {threadReplies.length === 1 ? 'Reply' : 'Replies'}</p>
            </div>
            <button className="st-icon-btn"><MoreVertical size={24} /></button>
          </header>

          <div className="st-thread-rail-wrap custom-scrollbar" ref={threadScrollRef}>
            <div className="st-thread-rail"></div>
            
            <div className="pt-6">
              <div className="st-original-pill">Original Announcement</div>
              <div className="st-thread-item is-root">
                <div className="st-thread-avatar flex items-center justify-center bg-orange-500 text-white font-bold text-[12px]">
                  {getInitials(activeThread.sender_name)}
                </div>
                <div className="st-thread-card">
                  <div className="st-thread-meta flex items-center justify-between gap-4 mb-1">
                    <span className="font-bold text-[14px] text-slate-800">{activeThread.sender_name}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{formatTime(activeThread.created_at)}</span>
                  </div>
                  <div className="text-[14px] text-slate-700 leading-relaxed">{activeThread.content}</div>
                  <div className="mt-1"></div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-4" style={{ marginLeft: '60px' }}>
              {threadReplies.length} {threadReplies.length === 1 ? 'Reply' : 'Replies'}
            </div>

            <div className="pb-32">
              {threadLoading ? (
                <div className="p-12 text-center"><div className="w-6 h-6 border-2 border-slate-100 border-t-orange-500 rounded-full animate-spin mx-auto"></div></div>
              ) : (
                <>
                  {threadReplies.map((reply) => (
                    <div key={reply.id} className="st-thread-item animate-fade">
                      <div className="st-thread-avatar flex items-center justify-center bg-slate-200 text-slate-600 font-bold text-[10px]">
                        {getInitials(reply.sender_name)}
                      </div>
                      <div className="st-thread-card">
                        <div className="st-thread-meta flex items-center justify-between gap-4 mb-1">
                          <span className="font-bold text-[13px] text-slate-800">{reply.sender_name}</span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{formatTime(reply.created_at)}</span>
                        </div>
                        <div className="text-[14px] text-slate-700">{reply.content}</div>
                        <div className="mt-1"></div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="st-chat-input-bar">
            <button className="st-icon-btn text-slate-400"><Plus size={26} /></button>
            <div className="st-input-container">
              <input
                type="text"
                placeholder="Reply to thread..."
                value={threadInput}
                onChange={(e) => setThreadInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleThreadSend()}
              />
              <Smile size={22} className="text-slate-400" />
            </div>
            <button className="st-send-btn shadow-lg" onClick={handleThreadSend} disabled={threadLoading}>
              <Send size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-6" onClick={() => setConfirmDeleteId(null)}>
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-fade" onClick={e => e.stopPropagation()}>
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MoreVertical size={32} className="rotate-90" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Message?</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">
                   Are you sure you want to delete this message? This action is permanent and cannot be undone.
                 </p>
              </div>
              <div className="flex border-t border-slate-100">
                 <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-5 text-sm font-bold text-slate-400 border-r border-slate-100 hover:bg-slate-50"
                 >
                   CANCEL
                 </button>
                 <button 
                  onClick={() => handleDeleteMessage(confirmDeleteId)}
                  className="flex-1 py-5 text-sm font-bold text-red-500 hover:bg-red-50"
                 >
                   DELETE
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

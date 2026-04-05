import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Search, MoreVertical, Send, Smile, Plus, Info, 
  Megaphone, ThumbsUp, Reply, Paperclip, Users, Bell 
} from 'lucide-react';
import api from '../../api';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';

const resolveSocketUrl = () => {
  const configuredApi = import.meta.env.VITE_API_URL;
  if (configuredApi && /^https?:\/\//.test(configuredApi)) {
    return configuredApi.replace(/\/api\/?$/, '');
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
};

const FacultyChatWindow = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [faculty, setFaculty] = useState(null);
  
  // Advanced Features (Mirrored from Student)
  const [activeThread, setActiveThread] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadInput, setThreadInput] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollRef = useRef(null);
  const threadScrollRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchChannelDetails();
    loadMessages();
    setupSocket();
    markAsRead();
    
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [channelId]);

  useEffect(() => {
    if (scrollRef.current && !activeThread) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (threadScrollRef.current) {
      threadScrollRef.current.scrollTop = threadScrollRef.current.scrollHeight;
    }
  }, [threadReplies]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/faculty/dashboard');
      setFaculty(res.data.profile);
    } catch (err) { console.error(err); }
  };

  const fetchChannelDetails = async () => {
    try {
      const res = await api.get(`/faculty/chat/channels/${channelId}`);
      setChannel(res.data);
    } catch (err) { console.error(err); }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/faculty/chat/channels/${channelId}/messages`);
      setMessages(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const markAsRead = async () => {
    try {
      await api.post(`/faculty/chat/channels/${channelId}/read`);
    } catch (err) { console.error('Failed to mark read', err); }
  };

  const setupSocket = () => {
    const token = sessionStorage.getItem('faculty_token');
    if (!token) return;
    const socket = io(resolveSocketUrl(), { auth: { token } });
    socket.on('connect', () => socket.emit('chat:join-channel', { channelId }));
    socket.on('chat:new-message', (msg) => {
      if (Number(msg.channel_id) === Number(channelId)) {
        if (msg.parent_id) {
           if (activeThread?.id === msg.parent_id) {
              setThreadReplies(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
           }
           setMessages(prev => prev.map(m => m.id === msg.parent_id ? { ...m, reply_count: (m.reply_count || 0) + 1 } : m));
        } else {
           setMessages(prev => {
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, msg];
           });
        }
        markAsRead(); // Auto-read if window is open
      }
    });
    socketRef.current = socket;
  };

  const handleSend = async (isThread = false) => {
    const text = isThread ? threadInput : inputValue;
    if (!text.trim()) return;
    try {
      const res = await api.post(`/faculty/chat/channels/${channelId}/messages`, {
        content: text,
        type: 'text',
        parent_id: isThread ? activeThread.id : null
      });
      if (isThread) {
        setThreadInput('');
        setThreadReplies(prev => {
          if (prev.some(m => m.id === res.data.id)) return prev;
          return [...prev, res.data];
        });
      } else {
        setInputValue('');
        setMessages(prev => {
          if (prev.some(m => m.id === res.data.id)) return prev;
          return [...prev, res.data];
        });
      }
    } catch (err) { console.error('Send failed'); }
  };

  const openThread = async (msg) => {
    setActiveThread(msg);
    setThreadLoading(true);
    try {
      const res = await api.get(`/faculty/chat/messages/${msg.id}/replies`);
      setThreadReplies(res.data || []);
    } catch (err) { console.error(err); } finally { setThreadLoading(false); }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

  const renderBubble = (msg, isThreadItem = false) => {
    const isOwn = Number(msg.sender_id) === Number(faculty?.id);
    return (
      <div key={msg.id} className={`flex gap-3 mb-6 ${isOwn ? 'flex-row-reverse' : ''}`}>
        {!isOwn && (
           <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white">
              {getInitials(msg.sender_name)}
           </div>
        )}
        <div className={`flex flex-col max-w-[80%] ${isOwn ? 'items-end' : ''}`}>
           {isOwn ? (
              <div className="flex flex-col items-end mb-1">
                 <span className="text-[7px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-widest mb-0.5">Faculty</span>
                 <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{formatTime(msg.created_at)}</span>
                    <span className="text-[11px] font-black text-slate-800 tracking-tight">You</span>
                 </div>
              </div>
           ) : (
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[11px] font-black text-slate-800 tracking-tight">{msg.sender_name}</span>
                 <span className="text-[9px] font-bold text-slate-400 uppercase">{formatTime(msg.created_at)}</span>
                 {msg.sender_role === 'faculty' && <span className="text-[8px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Faculty</span>}
              </div>
           )}
           <div 
            onClick={() => !isThreadItem && !msg.parent_id && openThread(msg)}
            className={`p-3.5 rounded-3xl text-[14px] leading-relaxed shadow-sm transition-all active:scale-[0.98] ${
              isOwn ? 'bg-orange-600 text-white rounded-tr-none min-w-[60px] text-center' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
           }`}>
              {msg.content}
           </div>
           {!isThreadItem && !msg.parent_id && (
              <div className="flex gap-4 mt-1 px-1">
                 <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1" onClick={() => openThread(msg)}>
                    <Reply size={12} strokeWidth={3} /> {msg.reply_count || 0} Replies
                 </button>
                 <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                    <ThumbsUp size={12} strokeWidth={3} /> React
                 </button>
              </div>
           )}
        </div>
      </div>
    );
  };

  if (loading && !channel) return <div className="st-shell items-center justify-center flex"><div className="w-10 h-10 border-4 border-slate-50 border-t-orange-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-white flex flex-col h-full overflow-hidden">
        {/* Header - Advanced Features Integration */}
        {!showInfo ? (
          <>
            <header className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-white z-[90]">
               <div className="flex items-center gap-4">
                  <button onClick={() => activeThread ? setActiveThread(null) : navigate('/faculty/messages')} className="p-1 -ml-2 text-slate-400">
                     <ArrowLeft size={24} />
                  </button>
                  <div className="flex flex-col">
                     <h1 className="text-[16px] font-black text-slate-800 tracking-tight max-w-[180px] truncate leading-tight">
                        {activeThread ? 'Thread Discussion' : (channel?.name || 'Group Chat')}
                     </h1>
                     <button onClick={() => !activeThread && setShowInfo(true)} className="flex items-center gap-1 text-left">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                           {activeThread ? `Discussing signal #${activeThread.id}` : `${channel?.members?.length || 0} Participants`}
                        </span>
                     </button>
                  </div>
               </div>
               <div className="flex gap-1">
                  <button className="p-2 text-slate-400" onClick={() => setIsSearching(!isSearching)}><Search size={20} /></button>
                  <button className="p-2 text-slate-400" onClick={() => setShowInfo(true)}><Info size={20} /></button>
               </div>
            </header>

            {/* Main Area: Thread or Channel */}
            <main className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-32 bg-slate-50/10" ref={activeThread ? threadScrollRef : scrollRef}>
               {activeThread ? (
                  <div className="py-4">
                     <div className="mb-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <div className="text-[10px] font-black text-orange-600 uppercase mb-2 tracking-widest">Original Message</div>
                        {renderBubble(activeThread, true)}
                     </div>
                     <div className="px-1 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                        Signal Thread
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                     </div>
                     {threadReplies.map(r => renderBubble(r, true))}
                  </div>
               ) : (
                  <div className="py-5">
                    {/* Header Summary for Channel */}
                    <div className="text-center mb-10 mt-4">
                       <div className="w-20 h-20 bg-orange-50 rounded-3xl mx-auto flex items-center justify-center text-orange-600 mb-4 shadow-sm">
                          <Users size={32} />
                       </div>
                       <h2 className="text-[20px] font-black text-slate-800">{channel?.name}</h2>
                       <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-full inline-block px-4 py-1.5 mt-2">
                          {channel?.type} Portal
                       </p>
                    </div>

                    <div className="flex items-center justify-center mb-8">
                       <div className="px-4 py-1.5 bg-slate-100/60 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Feed Active</div>
                    </div>

                    {messages.map(m => renderBubble(m))}
                  </div>
               )}
            </main>

            {/* Sticky Input Bar */}
            <div className="px-5 py-4 bg-white border-t border-slate-50 fixed bottom-0 left-0 right-0 z-[100] safe-area-bottom">
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-300">
                     <button className="p-1.5 hover:text-orange-500 transition-colors"><Plus size={22} strokeWidth={2.5} /></button>
                     <button className="p-1.5 hover:text-orange-500 transition-colors"><Paperclip size={20} strokeWidth={2.5} /></button>
                  </div>
                  <div className="flex-1 relative flex items-center">
                     <input 
                        type="text"
                        placeholder={activeThread ? "Reply to thread..." : "Message group..."}
                        className="w-full h-11 bg-slate-50 rounded-full pl-5 pr-11 font-bold text-[14px] text-slate-800 border-none outline-none focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
                        value={activeThread ? threadInput : inputValue}
                        onChange={e => activeThread ? setThreadInput(e.target.value) : setInputValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend(!!activeThread)}
                     />
                     <Smile size={18} className="absolute right-4 text-slate-300" />
                  </div>
                  <button 
                    onClick={() => handleSend(!!activeThread)}
                    className="w-11 h-11 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-100 active:scale-90 transition-all"
                  >
                     <Send size={18} fill="currentColor" />
                  </button>
               </div>
            </div>
          </>
        ) : (
          /* Info Page - Detailed view of group members */
          <div className="flex flex-col h-full bg-white animate-fade">
             <header className="p-5 flex items-center gap-4 border-b border-slate-50">
                <button onClick={() => setShowInfo(false)} className="text-slate-400"><ArrowLeft size={24} /></button>
                <h1 className="text-[18px] font-black text-slate-800 tracking-tight">Group Info</h1>
             </header>
             <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="text-center mb-10">
                   <div className="w-24 h-24 bg-slate-50 rounded-[40px] mx-auto flex items-center justify-center text-orange-600 mb-5 shadow-inner">
                      <Users size={40} />
                   </div>
                   <h2 className="text-[22px] font-black text-slate-800">{channel?.name}</h2>
                   <p className="text-[13px] font-bold text-slate-400 mt-1">{channel?.members?.length || 0} participants</p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants</h3>
                      <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Search</button>
                   </div>
                   {channel?.members?.map(m => (
                      <div key={m.id} className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">
                            {getInitials(m.name)}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[14px] font-bold text-slate-800">{m.name}</span>
                               {m.role === 'faculty' && <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Faculty</span>}
                            </div>
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter">{m.dept_name || 'Department'}</span>
                         </div>
                         {m.is_online ? <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-100"></div> : null}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyChatWindow;

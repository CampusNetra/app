import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MoreVertical, Send, Smile, Plus, Info, Megaphone, ThumbsUp, Reply } from 'lucide-react';
import api from '../../../api';

const ChatWindow = ({ channel, user, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadInput, setThreadInput] = useState('');
  
  const scrollRef = useRef(null);
  const threadScrollRef = useRef(null);

  useEffect(() => {
    if (channel?.id) {
      loadMessages();
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

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    try {
      await api.post(`/student/chat/channels/${channel.id}/messages`, {
        content: inputValue,
        type: 'text'
      });
      setInputValue('');
      loadMessages();
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleThreadSend = async () => {
    if (!threadInput.trim() || !activeThread) return;
    try {
      await api.post(`/student/chat/channels/${channel.id}/messages`, {
        content: threadInput,
        type: 'text',
        parent_id: activeThread.id
      });
      setThreadInput('');
      openThread(activeThread);
    } catch (err) {
      console.error('Reply failed:', err);
    }
  };

  const renderMessageCard = (msg) => {
    const isAnnouncement = msg.type === 'announcement' || msg.sender_role === 'faculty' || msg.sender_role === 'admin';
    const canReply = isAnnouncement || Number(msg.reply_count || 0) > 0;
    const isOwn = Number(msg.sender_id) === Number(user?.id);
    const roleLabel = msg.sender_role === 'admin' ? 'Dept Admin' : (msg.sender_role === 'faculty' ? 'Faculty' : '');

    return (
      <div key={msg.id} className={`st-msg-wrap animate-fade ${isOwn ? 'own' : ''}`}>
        {!isOwn && (
          <div className="st-msg-avatar">
            {getInitials(msg.sender_name)}
          </div>
        )}
        <div className="st-msg-main">
          {!isOwn && (
            <div className="st-msg-sender">
              <span className="st-sender-name">{msg.sender_name}</span>
              {roleLabel && <span className="st-role-label">{roleLabel}</span>}
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
            <div className="st-msg-text">{msg.content}</div>
            <div className="st-msg-footer">
              <span className="st-msg-time-internal">{formatTime(msg.created_at)}</span>
            </div>
          </div>
          <div className="st-card-actions">
            <button className="st-action-btn" onClick={() => openThread(msg)}>
              <Reply size={14} /> REPLY
            </button>
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
      {!activeThread ? (
        <div className="st-chat-shell">
          <header className="st-win-header-v2">
            <button onClick={onBack} className="st-icon-btn">
              <ArrowLeft size={24} />
            </button>
            <div className="st-win-info">
              <h1>{channel.name}</h1>
              <p>{channel.member_count || 124} participants</p>
            </div>
            <div className="flex gap-2">
              <button className="st-icon-btn"><Search size={22} /></button>
              <button className="st-icon-btn"><Info size={22} /></button>
            </div>
          </header>

          <div className="st-chat-messages custom-scrollbar" ref={scrollRef}>
            {loading ? (
              <div className="p-20 text-center"><div className="w-8 h-8 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mx-auto"></div></div>
            ) : (
              <>
                <div className="st-date-separator"><div className="st-date-pill">TODAY</div></div>
                {messages.map(renderMessageCard)}
                {messages.length === 0 && <div className="p-20 text-center text-slate-400">No signals found here yet.</div>}
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
                  <div className="st-thread-meta">
                    <span className="font-bold text-[14px]">{activeThread.sender_name}</span>
                    <span className="text-[11px] text-slate-400">{formatTime(activeThread.created_at)}</span>
                  </div>
                  <div className="text-[14px] text-slate-700 leading-relaxed">{activeThread.content}</div>
                  <div className="st-thread-actions">
                    <button className="st-like-badge px-3 py-1 bg-slate-50 text-slate-400 flex items-center gap-2 rounded-full text-[11px] font-bold">
                      <ThumbsUp size={12} /> 0
                    </button>
                    <button className="text-orange-500 text-[11px] font-bold flex items-center gap-1 uppercase">
                      <Reply size={12} /> Reply
                    </button>
                  </div>
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
                        <div className="st-thread-meta">
                          <span className="font-bold text-[13px]">{reply.sender_name}</span>
                          <span className="text-[10px] text-slate-400">just now</span>
                        </div>
                        <div className="text-[14px] text-slate-700">{reply.content}</div>
                        <div className="st-thread-actions">
                          <button className="st-like-badge px-3 py-1 bg-slate-50 text-slate-400 flex items-center gap-2 rounded-full text-[11px] font-bold">
                            <ThumbsUp size={12} /> 0
                          </button>
                          <button className="text-orange-500 text-[11px] font-bold flex items-center gap-1 uppercase">
                            <Reply size={12} /> Reply
                          </button>
                        </div>
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
    </div>
  );
};

export default ChatWindow;

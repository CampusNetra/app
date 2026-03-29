import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Search, MoreVertical, Plus, Smile, Send, Paperclip } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../../api';

const ChatWindow = ({ channel, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const user = JSON.parse(sessionStorage.getItem('student_user') || '{}');

  // Socket Connection
  useEffect(() => {
    const token = sessionStorage.getItem('student_token');
    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.emit('chat:join-channel', { channelId: channel.id });

    socketRef.current.on('chat:new-message', (msg) => {
       if (Number(msg.channel_id) === Number(channel.id)) {
         setMessages(prev => [...prev, msg]);
       }
    });

    return () => {
      socketRef.current.emit('chat:leave-channel', { channelId: channel.id });
      socketRef.current.disconnect();
    };
  }, [channel.id]);

  // Initial Load
  useEffect(() => {
    const fetchMessages = async () => {
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
    fetchMessages();
  }, [channel.id]);

  // Scroll to Bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    try {
      const resp = await api.post(`/student/chat/channels/${channel.id}/messages`, {
        content: inputValue,
        type: 'text'
      });
      // Message is already emitted via socket in backend
      setInputValue('');
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  return (
    <div className="st-chat-window">
      <header className="st-chat-win-header">
        <button onClick={onBack} className="text-slate-600"><ChevronLeft size={24} /></button>
        <div className="st-chat-win-title">
           <h3>{channel.name}</h3>
           <p>{channel.member_count} members, 12 online</p>
        </div>
        <div className="st-chat-win-options">
           <Search size={20} />
           <MoreVertical size={20} />
        </div>
      </header>

      <div className="st-chat-messages" ref={scrollRef}>
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-slate-400">
             Decrypting conversations...
          </div>
        ) : (
          <>
            <div className="st-date-badge">Today</div>
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`st-msg-group ${msg.sender_id === user.id ? 'own' : ''}`}>
                <div className="st-msg-avatar bg-slate-200"></div>
                <div className="st-msg-content">
                  <span className="st-msg-sender">
                     {msg.sender_id === user.id ? 'You' : msg.sender_name}
                     {msg.sender_role === 'faculty' && <span className="text-primary ml-1 font-black">✔</span>}
                  </span>
                  <div className="st-msg-bubble">
                     {msg.content}
                     <span className="st-msg-time">
                       {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       {msg.sender_id === user.id && <span className="ml-1">✔✔</span>}
                     </span>
                  </div>
                  {msg.reply_count > 0 && <span className="st-msg-replies leading-none mb-1 cursor-pointer">💬 {msg.reply_count} replies</span>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="st-chat-input-bar">
         <button className="text-slate-400"><Plus size={24} /></button>
         <div className="st-input-container">
            <input 
              type="text" 
              placeholder="Message..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <Smile size={20} className="text-slate-400" />
         </div>
         <button className="st-send-btn" onClick={handleSend}>
            <Send size={20} fill="white" />
         </button>
      </div>
    </div>
  );
};

export default ChatWindow;

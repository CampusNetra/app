import React, { useEffect, useRef, useState } from 'react';
import api from '../../../api';
import { io } from 'socket.io-client';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import './chat-styles.css';
import { MessageSquare } from 'lucide-react';

const resolveSocketUrl = () => {
  const configuredApi = import.meta.env.VITE_API_URL;
  if (configuredApi && /^https?:\/\//.test(configuredApi)) {
    return configuredApi.replace(/\/api\/?$/, '');
  }
  return window.location.origin;
};

const ChatSystem = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [threadReplies, setThreadReplies] = useState([]);
  const [activeThreadMessage, setActiveThreadMessage] = useState(null);
  const [channelDetails, setChannelDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const activeChannelRef = useRef(null);
  const activeThreadRef = useRef(null);

  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  useEffect(() => {
    activeThreadRef.current = activeThreadMessage;
  }, [activeThreadMessage]);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
    };
  }, []);

  const ensureSocketConnected = () => {
    if (socketRef.current) return socketRef.current;

    const token = localStorage.getItem('token');
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

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('connect_error', () => {
      setSocketConnected(false);
    });

    socket.on('chat:new-message', (incomingMessage) => {
      if (!incomingMessage?.id) return;

      const currentChannelId = activeChannelRef.current?.id;
      if (Number(incomingMessage.channel_id) === Number(currentChannelId)) {
        if (incomingMessage.parent_id) {
          if (Number(activeThreadRef.current?.id) === Number(incomingMessage.parent_id)) {
            setThreadReplies((prev) => {
              if (prev.some((msg) => msg.id === incomingMessage.id)) {
                return prev;
              }
              return [...prev, incomingMessage];
            });
          }

          setMessages((prev) => prev.map((msg) => {
            if (Number(msg.id) !== Number(incomingMessage.parent_id)) {
              return msg;
            }
            return { ...msg, reply_count: Number(msg.reply_count || 0) + 1 };
          }));
        } else {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === incomingMessage.id)) {
              return prev;
            }
            return [...prev, incomingMessage];
          });
        }
      }

      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          Number(channel.id) === Number(incomingMessage.channel_id)
            ? {
                ...channel,
                last_message: incomingMessage.content,
                last_message_time: incomingMessage.created_at,
                last_sender: incomingMessage.sender_name
              }
            : channel
        )
      );
    });

    socketRef.current = socket;
    return socket;
  };

  useEffect(() => {
    if (!activeChannel) {
      setMessages([]);
      setThreadReplies([]);
      setActiveThreadMessage(null);
      setChannelDetails(null);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return undefined;
    }

    fetchMessages(activeChannel.id);
    fetchChannelDetails(activeChannel.id);

    const socket = ensureSocketConnected();
    if (socket) {
      socket.emit('chat:join-channel', { channelId: activeChannel.id });
    }

    return () => {
      if (socket) {
        socket.emit('chat:leave-channel', { channelId: activeChannel.id });
      }
    };
  }, [activeChannel]);

  useEffect(() => {
    if (!activeChannel) return undefined;

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (!socketConnected) {
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(activeChannel.id, true);
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [activeChannel, socketConnected]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/chat/channels');
      setChannels(res.data || []);
      if (res.data && res.data.length > 0 && !activeChannelRef.current) {
        setActiveChannel(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch channels', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId, silent = false) => {
    try {
      const res = await api.get(`/admin/chat/channels/${channelId}/messages`);
      const topLevelMessages = (res.data || []).filter((m) => !m.parent_id);

      if (!silent) {
        setMessages(topLevelMessages);
        return;
      }

      setMessages((prev) => {
        const incoming = topLevelMessages;
        if (
          prev.length === incoming.length &&
          prev[prev.length - 1]?.id === incoming[incoming.length - 1]?.id
        ) {
          return prev;
        }
        return incoming;
      });
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const fetchChannelDetails = async (channelId) => {
    try {
      const res = await api.get(`/admin/chat/channels/${channelId}/details`);
      setChannelDetails(res.data || null);
    } catch (err) {
      console.error('Failed to fetch channel details', err);
    }
  };

  const fetchThreadReplies = async (messageId) => {
    try {
      const res = await api.get(`/admin/chat/messages/${messageId}/replies`);
      setThreadReplies(res.data || []);
    } catch (err) {
      console.error('Failed to fetch thread replies', err);
      setThreadReplies([]);
    }
  };

  const handleSendMessage = async (content, options = {}) => {
    if (!activeChannel) return;

    try {
      const payload = {
        content,
        type: options.type || 'text'
      };

      if (options.parent_id) {
        payload.parent_id = options.parent_id;
      }

      const res = await api.post(`/admin/chat/channels/${activeChannel.id}/messages`, payload);

      if (!options.parent_id) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === res.data?.id)) {
            return prev;
          }
          return [...prev, res.data];
        });
      } else if (activeThreadMessage?.id) {
        await fetchThreadReplies(activeThreadMessage.id);
        await fetchMessages(activeChannel.id, true);
      }

      setChannels((prev) => prev.map((c) =>
        c.id === activeChannel.id
          ? {
              ...c,
              last_message: options.type === 'announcement' ? `Announcement: ${content}` : content,
              last_message_time: res.data?.created_at || new Date().toISOString(),
              last_sender: res.data?.sender_name || c.last_sender
            }
          : c
      ));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleOpenThread = async (message) => {
    setActiveThreadMessage(message);
    await fetchThreadReplies(message.id);
  };

  const handleCloseThread = () => {
    setActiveThreadMessage(null);
    setThreadReplies([]);
  };

  const handleRefreshDetails = async () => {
    if (!activeChannel?.id) return;
    await fetchChannelDetails(activeChannel.id);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatSidebar 
        channels={channels} 
        activeChannel={activeChannel}
        onSelectChannel={setActiveChannel}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {activeChannel ? (
        <ChatWindow 
          channel={activeChannel}
          messages={messages}
          onSendMessage={handleSendMessage}
          onOpenThread={async (message) => {
            setShowDetails(false);
            await handleOpenThread(message);
          }}
          onCloseThread={handleCloseThread}
          activeThreadMessage={activeThreadMessage}
          threadReplies={threadReplies}
          onSendThreadReply={(content) => handleSendMessage(content, { parent_id: activeThreadMessage?.id, type: 'text' })}
          channelDetails={channelDetails}
          showDetails={showDetails}
          onShowDetails={() => {
            setActiveThreadMessage(null);
            setThreadReplies([]);
            setShowDetails(true);
          }}
          onCloseDetails={() => setShowDetails(false)}
          onRefreshDetails={handleRefreshDetails}
          currentUser={currentUser}
          socketConnected={socketConnected}
          onBack={() => setActiveChannel(null)}
        />
      ) : (
        <div className="chat-main empty-chat">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
            <MessageSquare size={40} />
          </div>
          <h3>Select a conversation</h3>
          <p>Choose a channel from the sidebar to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;

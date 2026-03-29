import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CheckCheck,
  Clipboard,
  Download,
  Filter,
  Info,
  Megaphone,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  X
} from 'lucide-react';

const ChatWindow = ({
  channel,
  messages,
  onSendMessage,
  onOpenThread,
  onCloseThread,
  activeThreadMessage,
  threadReplies,
  onSendThreadReply,
  channelDetails,
  showDetails,
  onShowDetails,
  onCloseDetails,
  onRefreshDetails,
  currentUser,
  socketConnected,
  onBack
}) => {
  const [inputValue, setInputValue] = useState('');
  const [threadInput, setThreadInput] = useState('');
  const [composerMode, setComposerMode] = useState('text');
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
  const [threadSearch, setThreadSearch] = useState('');
  const [threadSort, setThreadSort] = useState('oldest');
  const [membersSearch, setMembersSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');
  const [detailsTab, setDetailsTab] = useState('overview');
  const [resolvedThreads, setResolvedThreads] = useState({});
  const scrollRef = useRef(null);
  const threadScrollRef = useRef(null);

  const resolveStorageKey = `adminResolvedThreads:${channel?.id || 'unknown'}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (threadScrollRef.current) {
      threadScrollRef.current.scrollTop = threadScrollRef.current.scrollHeight;
    }
  }, [threadReplies, activeThreadMessage]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(resolveStorageKey);
      if (raw) {
        setResolvedThreads(JSON.parse(raw));
      } else {
        setResolvedThreads({});
      }
    } catch (error) {
      setResolvedThreads({});
    }
  }, [resolveStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(resolveStorageKey, JSON.stringify(resolvedThreads));
    } catch (error) {
      // Ignore localStorage errors in private mode.
    }
  }, [resolvedThreads, resolveStorageKey]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue, { type: composerMode });
    setInputValue('');
    setComposerMode('text');
  };

  const handleThreadSend = () => {
    if (!threadInput.trim()) return;
    onSendThreadReply(threadInput);
    setThreadInput('');
  };

  const getMessageTypeLabel = (type) => {
    if (type === 'announcement') return 'Announcement';
    return 'Message';
  };

  const toggleThreadResolved = (messageId) => {
    setResolvedThreads((prev) => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const filteredThreadReplies = [...threadReplies]
    .filter((reply) => {
      if (!threadSearch.trim()) return true;
      const q = threadSearch.trim().toLowerCase();
      return (
        (reply.sender_name || '').toLowerCase().includes(q) ||
        (reply.content || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return threadSort === 'oldest' ? aTime - bTime : bTime - aTime;
    });

  const unresolvedCount = messages.filter((msg) => Number(msg.reply_count || 0) > 0 && !resolvedThreads[msg.id]).length;
  const visibleMessages = showOnlyUnresolved
    ? messages.filter((msg) => Number(msg.reply_count || 0) > 0 && !resolvedThreads[msg.id])
    : messages;

  const allFaculty = channelDetails?.faculty || [];
  const allStudents = channelDetails?.students || [];
  const allMembers = [...allFaculty, ...allStudents];

  const filteredMembers = allMembers.filter((member) => {
    const byRole = memberRoleFilter === 'all' || member.role === memberRoleFilter;
    const bySearch = !membersSearch.trim() || member.name.toLowerCase().includes(membersSearch.trim().toLowerCase());
    return byRole && bySearch;
  });

  const exportMembersCsv = () => {
    const header = 'name,role\n';
    const rows = filteredMembers.map((m) => `"${m.name.replace(/"/g, '""')}","${m.role}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(channel?.name || 'group').replace(/\s+/g, '_').toLowerCase()}_members.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyGroupId = async () => {
    if (!channel?.id) return;
    try {
      await navigator.clipboard.writeText(String(channel.id));
    } catch (error) {
      // Clipboard may be unavailable in insecure context.
    }
  };

  const quickReplies = [
    'Please keep replies in one thread.',
    'Noted. I will share an update shortly.',
    'Thanks everyone, this is now resolved.'
  ];

  const isSidePanelOpen = Boolean(activeThreadMessage || showDetails);

  return (
    <div className={`chat-main ${isSidePanelOpen ? 'with-side-panel' : ''}`}>
      <div className="chat-main-content">
      <header className="chat-main-header">
        <div className="chat-header-info">
          <button className="chat-icon-btn d-md-none" onClick={onBack}><ArrowLeft size={20} /></button>
          <div className="chat-avatar-wrap">
            <div className="chat-avatar admin-group-avatar">{(channel.name || 'A').slice(0, 2).toUpperCase()}</div>
          </div>
          <div className="chat-header-text">
            <h2>{channel.name}</h2>
            <p>
              {channel.member_count || 0} members · {socketConnected ? 'live updates' : 'polling fallback'}
              {/* <span className="header-unresolved-pill">{unresolvedCount} unresolved</span> */}
            </p>
          </div>
        </div>
        <div className="chat-header-actions">
          <button
            className={`chat-icon-btn unresolved-filter-btn ${showOnlyUnresolved ? 'active' : ''}`}
            onClick={() => setShowOnlyUnresolved((prev) => !prev)}
            title="Toggle unresolved threads"
          >
            {showOnlyUnresolved ? 'All' : 'Open'}
          </button>
          <button className="chat-icon-btn" onClick={onShowDetails} title="Group details"><Info size={20} /></button>
        </div>
      </header>

      <div className="chat-messages custom-scrollbar" ref={scrollRef}>
        <div className="chat-date-sep"><span>TODAY</span></div>

        {visibleMessages.map((msg) => {
          const isMe = msg.sender_id === currentUser?.id;
          const isAnnouncement = msg.type === 'announcement';
          const isResolved = !!resolvedThreads[msg.id];

          return (
            <div key={msg.id} className={`message-item ${isMe ? 'outgoing' : 'incoming'}`}>
              {!isMe && <div className="message-sender">{msg.sender_name}</div>}
              <div className={`message-bubble ${isAnnouncement ? 'announcement-bubble' : ''}`}>
                {isAnnouncement && (
                  <div className="announcement-tag">
                    <Megaphone size={14} />
                    Admin Announcement
                  </div>
                )}
                <div>{msg.content}</div>

                <div className="message-meta">
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="message-type-pill">{getMessageTypeLabel(msg.type)}</span>
                  {isMe && <CheckCheck size={12} />}
                </div>

                <div className="message-actions-row">
                  <button className="message-inline-btn" onClick={() => onOpenThread(msg)}>
                    <MessageCircle size={13} />
                    {msg.reply_count ? `${msg.reply_count} replies` : 'Reply in thread'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {visibleMessages.length === 0 && (
          <div className="thread-empty-state">No unresolved threads in this channel.</div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="chat-compose-mode-toggle">
          <button
            className={`compose-mode-btn ${composerMode === 'text' ? 'active' : ''}`}
            onClick={() => setComposerMode('text')}
          >
            Message
          </button>
          <button
            className={`compose-mode-btn ${composerMode === 'announcement' ? 'active announce' : ''}`}
            onClick={() => setComposerMode('announcement')}
          >
            <Sparkles size={12} />
            Announcement
          </button>
        </div>

        <div className="chat-input-wrap">
          <input
            type="text"
            placeholder={composerMode === 'announcement' ? 'Write an important admin update...' : 'Write a message'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button className="chat-send-btn" onClick={handleSend}>
          <Send size={20} />
        </button>
      </div>
      </div>

      {activeThreadMessage && (
        <aside className="chat-side-panel">
          <div className="chat-side-panel-header">
            <h3>Thread Replies</h3>
            <button className="chat-icon-btn" onClick={onCloseThread}><X size={18} /></button>
          </div>

          <div className="thread-root-message">
            <div className="thread-root-author">{activeThreadMessage.sender_name}</div>
            <div className="thread-root-content">{activeThreadMessage.content}</div>
            <div className="thread-root-meta-row">
              <span>{new Date(activeThreadMessage.created_at).toLocaleString()}</span>
              <button
                className={`message-inline-btn ${resolvedThreads[activeThreadMessage.id] ? 'resolved' : ''}`}
                onClick={() => toggleThreadResolved(activeThreadMessage.id)}
              >
                <BadgeCheck size={13} />
                {resolvedThreads[activeThreadMessage.id] ? 'Resolved' : 'Open Thread'}
              </button>
            </div>
          </div>

          <div className="thread-toolbar">
            <div className="thread-toolbar-search">
              <Filter size={14} />
              <input
                type="text"
                placeholder="Search replies"
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
              />
            </div>
            <div className="thread-sort-toggle">
              <button className={threadSort === 'oldest' ? 'active' : ''} onClick={() => setThreadSort('oldest')}>Oldest</button>
              <button className={threadSort === 'newest' ? 'active' : ''} onClick={() => setThreadSort('newest')}>Newest</button>
            </div>
          </div>

          <div className="thread-list custom-scrollbar" ref={threadScrollRef}>
            {filteredThreadReplies.map((reply) => (
              <div key={reply.id} className="thread-reply-item">
                <div className="thread-reply-author">{reply.sender_name}</div>
                <div className="thread-reply-content">{reply.content}</div>
                <div className="thread-reply-time">{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
            {filteredThreadReplies.length === 0 && (
              <div className="thread-empty-state">No replies match this filter.</div>
            )}
          </div>

          <div className="thread-quick-replies">
            {quickReplies.map((item) => (
              <button key={item} onClick={() => setThreadInput(item)}>{item}</button>
            ))}
          </div>

          <div className="thread-input-row">
            <input
              type="text"
              placeholder="Reply to thread"
              value={threadInput}
              onChange={(e) => setThreadInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleThreadSend()}
            />
            <button className="chat-send-btn" onClick={handleThreadSend}><Send size={18} /></button>
          </div>
        </aside>
      )}

      {showDetails && (
        <aside className="chat-side-panel details-panel">
          <div className="chat-side-panel-header">
            <h3>Group Details</h3>
            <div className="details-header-actions">
              <button className="chat-icon-btn" onClick={onRefreshDetails} title="Refresh details"><RefreshCw size={16} /></button>
              <button className="chat-icon-btn" onClick={copyGroupId} title="Copy group id"><Clipboard size={16} /></button>
              <button className="chat-icon-btn" onClick={onCloseDetails}><X size={18} /></button>
            </div>
          </div>

          <div className="group-details-hero">
            <div className="group-details-title">{channelDetails?.name || channel.name}</div>
            <div className="group-details-subtitle">
              {channelDetails?.member_count || channel.member_count || 0} members · {channelDetails?.faculty_count || 0} faculty
            </div>
            <div className="group-details-stats">
              <div className="details-stat-card">
                <Users size={14} />
                <span>{channelDetails?.member_count || allMembers.length}</span>
                <small>Total</small>
              </div>
              <div className="details-stat-card">
                <BadgeCheck size={14} />
                <span>{allFaculty.length}</span>
                <small>Faculty</small>
              </div>
              <div className="details-stat-card">
                <MessageCircle size={14} />
                <span>{allStudents.length}</span>
                <small>Students</small>
              </div>
            </div>
          </div>

          <div className="details-tabs">
            <button className={detailsTab === 'overview' ? 'active' : ''} onClick={() => setDetailsTab('overview')}>Overview</button>
            <button className={detailsTab === 'members' ? 'active' : ''} onClick={() => setDetailsTab('members')}>Members</button>
          </div>

          {detailsTab === 'overview' && (
            <div className="details-overview-grid">
              <div className="details-overview-item">
                <label>Department</label>
                <p>{channelDetails?.dept_name || 'Unknown'}</p>
              </div>
              <div className="details-overview-item">
                <label>Channel Type</label>
                <p>{(channelDetails?.type || channel.type || 'branch').toUpperCase()}</p>
              </div>
              <div className="details-overview-item">
                <label>Students</label>
                <p>{allStudents.length}</p>
              </div>
              <div className="details-overview-item">
                <label>Faculty</label>
                <p>{allFaculty.length}</p>
              </div>
            </div>
          )}

          {detailsTab === 'members' && (
            <>
              <div className="details-members-toolbar">
                <div className="details-search-inline">
                  <Filter size={14} />
                  <input
                    type="text"
                    placeholder="Search members"
                    value={membersSearch}
                    onChange={(e) => setMembersSearch(e.target.value)}
                  />
                </div>
                <select value={memberRoleFilter} onChange={(e) => setMemberRoleFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Students</option>
                </select>
                <button className="details-export-btn" onClick={exportMembersCsv}>
                  <Download size={14} /> Export
                </button>
              </div>

              <div className="details-section">
                {filteredMembers.map((member) => (
                  <div key={`${member.role}-${member.id}`} className="details-member-row details-member-row-rich">
                    <div>
                      <div className="details-member-name">{member.name}</div>
                      <div className="details-member-role">{member.role}</div>
                    </div>
                    <span className="details-member-role-pill">{member.role === 'faculty' ? 'Faculty' : 'Student'}</span>
                  </div>
                ))}
                {filteredMembers.length === 0 && <div className="thread-empty-state">No members match this filter.</div>}
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
};

export default ChatWindow;

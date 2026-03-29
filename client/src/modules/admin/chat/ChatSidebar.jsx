import React from 'react';
import { Search, MoreVertical, Megaphone, Edit3 } from 'lucide-react';

const ChatSidebar = ({ channels, activeChannel, onSelectChannel, searchTerm, setSearchTerm }) => {
  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnreadCount = (channelId) => {
    // For demo/real integration, we'll keep it simple for now
    return 0;
  };

  const getChannelIcon = (type) => {
    const styles = {
      branch: { bg: '#eaf2ff', fg: '#2952cc', glyph: 'BR' },
      section: { bg: '#e7f7ef', fg: '#0a7f48', glyph: 'SE' },
      subject: { bg: '#fff2e8', fg: '#b45309', glyph: 'SU' },
      default: { bg: '#eef2f7', fg: '#475569', glyph: 'GR' }
    };

    const style = styles[type] || styles.default;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='88' height='88'><rect width='88' height='88' rx='20' fill='${style.bg}'/><text x='44' y='53' text-anchor='middle' font-family='Arial, sans-serif' font-size='26' font-weight='700' fill='${style.fg}'>${style.glyph}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">
        <div className="chat-header-top">
          <button className="chat-icon-btn"><MoreVertical size={20} /></button>
          <h1>Chats</h1>
          <button className="chat-icon-btn"><Edit3 size={20} /></button>
        </div>
        <div className="chat-search-wrap">
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search messages or groups" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="chat-list custom-scrollbar">
        <div className="chat-category-label">Department Broadcast Group</div>
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            className={`chat-item ${activeChannel?.id === channel.id ? 'active' : ''}`}
            onClick={() => onSelectChannel(channel)}
          >
            <div className="chat-avatar-wrap">
              <img src={getChannelIcon(channel.type)} alt="" className="chat-avatar" />
              <div className="chat-status"></div>
            </div>
            <div className="chat-info">
              <div className="chat-info-top">
                <h3>{channel.name}</h3>
                <span className="chat-time">
                  {channel.last_message_time
                    ? new Date(channel.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </span>
              </div>
              <div className="chat-preview">
                <p>
                  {channel.last_sender ? `${channel.last_sender.split(' ')[0]}: ` : ''}
                  {channel.last_message || 'No messages yet'}
                </p>
                {getUnreadCount(channel.id) > 0 && (
                  <span className="chat-badge">{getUnreadCount(channel.id)}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredChannels.length === 0 && (
          <div className="chat-empty-side">
            <Megaphone size={18} />
            <p>No matching group found.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;

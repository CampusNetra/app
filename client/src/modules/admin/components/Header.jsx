import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';

const Header = ({ onOpenModal }) => {
  return (
    <header className="header">
      <div className="search-box">
        <div className="search-icon">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search for students, faculty, or channels..." 
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ 
          background: 'none', 
          border: '1px solid var(--border-color)', 
          padding: '10px', 
          borderRadius: '12px', 
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          position: 'relative',
          transition: 'all 0.2s'
        }}>
          <Bell size={22} />
          <div style={{ 
            width: '8px', height: '8px', background: 'var(--primary)', 
            borderRadius: '50%', position: 'absolute', top: '8px', 
            right: '8px', border: '2px solid white' 
          }}></div>
        </button>
        <button className="btn-primary" onClick={onOpenModal}>
          <Plus size={20} />
          <span>Create Announcement</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Search, Bell, Settings, Plus } from 'lucide-react';

const StudentTopBar = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="st-desktop-topbar">
      <div className="st-topbar-search">
        <div className="st-search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for research, groups, or events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="st-topbar-actions">
        <button className="st-topbar-btn">
          <Bell size={20} />
          <span className="dot"></span>
        </button>
      </div>
    </header>
  );
};

export default StudentTopBar;

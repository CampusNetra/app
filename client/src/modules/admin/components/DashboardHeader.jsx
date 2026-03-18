import React, { useState } from 'react';
import { Bell, Plus, Search } from 'lucide-react';
import api from '../../../api';
import NotificationModal from './NotificationModal';

const DashboardHeader = ({
  showCreateButton = false,
  onCreateAnnouncement,
  searchPlaceholder = 'Search for students, faculty, or channels...',
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState('');

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    setNotificationError('');
    try {
      const res = await api.get('/admin/activity');
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setNotificationError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    fetchNotifications();
  };

  return (
    <>
      <header className="h-[72px] px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="relative w-full max-w-[420px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#e5393520] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button
            type="button"
            onClick={openNotifications}
            className="w-11 h-11 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e53935] border border-white" />
          </button>

          {showCreateButton ? (
            <button
              type="button"
              onClick={onCreateAnnouncement}
              className="h-11 px-4 rounded-xl bg-[#e53935] hover:bg-[#d32f2f] text-white text-sm font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Create Announcement</span>
            </button>
          ) : null}
        </div>
      </header>

      <NotificationModal
        isOpen={isNotificationsOpen}
        notifications={notifications}
        loading={loadingNotifications}
        error={notificationError}
        onClose={() => setIsNotificationsOpen(false)}
        onRefresh={fetchNotifications}
      />
    </>
  );
};

export default DashboardHeader;

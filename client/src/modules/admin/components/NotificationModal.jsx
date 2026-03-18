import React from 'react';
import { Bell, RefreshCw, X } from 'lucide-react';

const formatTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationModal = ({
  isOpen,
  notifications,
  loading,
  error,
  onClose,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] bg-slate-900/35 backdrop-blur-[1px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="absolute top-[86px] right-8 w-[min(420px,calc(100vw-32px))] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRefresh}
              className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center"
              title="Refresh notifications"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="p-6 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-[#e53935] animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
              {error}
            </div>
          ) : notifications.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {notifications.map((item, index) => (
                <li key={`${item.created_at || 'n'}-${index}`} className="px-4 py-3 hover:bg-slate-50/80">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                        item.type === 'user' ? 'bg-[#1E88E5]' : 'bg-[#e53935]'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-800 leading-5">
                        <span className="font-semibold">{item.detail || 'Activity'}</span>{' '}
                        {item.action || ''} {item.role ? `as ${item.role}` : ''}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{formatTime(item.created_at)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">No notifications available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

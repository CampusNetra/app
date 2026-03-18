import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send } from 'lucide-react';

const CreateAnnouncementModal = ({ isOpen, onClose, onCreated }) => {
  const [channels, setChannels] = useState([]);
  const [formData, setFormData] = useState({
    channel_id: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingChannels, setFetchingChannels] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    setFetchingChannels(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, channel_id: res.data[0].id }));
      } else {
        setFormData(prev => ({ ...prev, channel_id: '' }));
      }
    } catch (err) {
      console.error('Failed to fetch channels', err);
      setError('Failed to load channels. Please try again.');
    } finally {
      setFetchingChannels(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.channel_id) {
      setError('Please select a target channel.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/announcements', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onCreated();
      onClose();
      setFormData({ channel_id: channels[0]?.id || '', content: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
      onClick={onClose}
      role="button"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div
        className="w-full max-w-[620px] rounded-2xl bg-white border border-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create New Announcement</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="announcement-channel" className="text-sm font-semibold text-slate-700">
              Target Channel
            </label>
            <select
              id="announcement-channel"
              value={formData.channel_id}
              onChange={(e) => setFormData({ ...formData, channel_id: e.target.value })}
              disabled={fetchingChannels || channels.length === 0}
              required
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#e5393520]"
            >
              {fetchingChannels ? <option>Loading channels...</option> : null}
              {!fetchingChannels && channels.length === 0 ? <option>No channels available</option> : null}
              {!fetchingChannels && channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.type})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="announcement-content" className="text-sm font-semibold text-slate-700">
              Announcement Content
            </label>
            <textarea
              id="announcement-content"
              placeholder="Type your announcement here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="6"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none resize-y focus:ring-2 focus:ring-[#e5393520]"
            />
          </div>

          <div className="pt-1 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || channels.length === 0 || fetchingChannels}
              className="h-11 px-4 rounded-xl bg-[#e53935] hover:bg-[#d32f2f] disabled:opacity-70 text-white text-sm font-bold flex items-center gap-2"
            >
              <Send size={16} />
              {loading ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;

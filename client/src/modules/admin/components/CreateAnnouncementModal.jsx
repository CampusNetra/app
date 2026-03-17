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
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, channel_id: res.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch channels', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Announcement</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}
          
          <div className="form-group">
            <label>Target Channel</label>
            <select 
              value={formData.channel_id}
              onChange={(e) => setFormData({ ...formData, channel_id: e.target.value })}
              required
            >
              {channels.map(ch => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} ({ch.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Announcement Content</label>
            <textarea
              placeholder="Type your announcement here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="5"
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Send size={18} />
              {loading ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;

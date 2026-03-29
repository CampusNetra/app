import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Info, ChevronRight, Check, Layout, Users, Calendar, MapPin, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import api from '../../../api';

const AnnouncementModal = ({ isOpen, onClose, onAnnouncementPosted }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('normal');
  const [targetType, setTargetType] = useState('department'); // 'department' or 'sections'
  const [selectedSections, setSelectedSections] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  
  // Event-specific states
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [regUrl, setRegUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get admin info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminDeptName = user.dept_name || 'Your Department';

  useEffect(() => {
    if (isOpen) {
      fetchSections();
    }
  }, [isOpen]);

  const fetchSections = async () => {
    setIsLoadingSections(true);
    try {
      const response = await api.get('/admin/sections');
      setAvailableSections(response.data || []);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and content for the announcement.');
      return;
    }

    if (targetType === 'sections' && selectedSections.length === 0) {
      setError('Please select at least one section to target.');
      return;
    }

    if (type === 'event' && !eventDate) {
      setError('Please provide an event date.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        type,
        visibility: targetType === 'department' ? 'all' : 'section',
        target_dept_id: user.dept_id,
        target_section_id: targetType === 'sections' ? selectedSections[0] : null,
        // Event info
        event_date: type === 'event' ? eventDate : null,
        event_location: type === 'event' ? eventLocation : null,
        event_registration_url: type === 'event' ? regUrl : null,
        image_url: type === 'event' ? imageUrl : null
      };

      const response = await api.post('/admin/announcements', {
        ...payload,
        sectionIds: targetType === 'sections' ? selectedSections : []
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess('Announcement broadcasted successfully!');
        resetForm();
        
        if (onAnnouncementPosted) {
          onAnnouncementPosted(response.data);
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Failed to broadcast announcement';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('normal');
    setTargetType('department');
    setSelectedSections([]);
    setEventDate('');
    setEventLocation('');
    setRegUrl('');
    setImageUrl('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Left Side: Tips and Reference */}
        <div style={{
          width: '320px',
          background: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '32px',
          display: 'none', 
        }} className="hidden md:flex flex-col">
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={20} className="text-orange-500" />
              Guidelines
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
              Create engaging announcements. For events, ensure dates and locations are accurate.
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Event Example
            </h4>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
              Tech Workshop 2024
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
               📅 April 20, 2:00 PM
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
               📍 Seminar Hall A
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', fontStyle: 'italic' }}>
              "Join us for a hands-on session on Cloud Computing. Register at the link below..."
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #ffedd5' }}>
            <p style={{ fontSize: '12px', color: '#9a3412', margin: 0, fontWeight: 500 }}>
              💡 Event announcements feature specialized cards on the student app with "Save to Calendar" and "Join" actions.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'white'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Create Announcement</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Post news or events to your department</p>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '10px',
                color: '#64748b',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="custom-scrollbar">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Category */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="normal">📢 Regular News</option>
                    <option value="important">⚠️ High Priority</option>
                    <option value="event">📅 Event / Workshop</option>
                  </select>
                </div>

                {/* Target Level */}
                <div>
                   <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    Target Audience
                  </label>
                  <div style={{ display: 'flex', gap: '8px', padding: '4px', background: '#f1f5f9', borderRadius: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setTargetType('department')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: targetType === 'department' ? 'white' : 'transparent',
                        color: targetType === 'department' ? '#0f172a' : '#64748b',
                        boxShadow: targetType === 'department' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      All Dept Students
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetType('sections')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: targetType === 'sections' ? 'white' : 'transparent',
                        color: targetType === 'sections' ? '#0f172a' : '#64748b',
                        boxShadow: targetType === 'sections' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      Specific Sections
                    </button>
                  </div>
                </div>
              </div>

              {/* Sections Multi-select */}
              {targetType === 'sections' && (
                <div style={{ 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {availableSections.length > 0 ? (
                      availableSections.map(section => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => handleSectionToggle(section.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            background: selectedSections.includes(section.id) ? '#fff7ed' : 'white',
                            borderColor: selectedSections.includes(section.id) ? '#f97316' : '#e2e8f0',
                            color: selectedSections.includes(section.id) ? '#f97316' : '#64748b'
                          }}
                        >
                          {selectedSections.includes(section.id) && <Check size={14} />}
                          {section.name}
                        </button>
                      ))
                    ) : (
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>No sections found.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Headline */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Meet 2024"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Event Fields - Expanded only if TYPE is EVENT */}
              {type === 'event' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  padding: '24px',
                  background: '#fffbf5',
                  borderRadius: '16px',
                  border: '1px solid #ffedd5',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 800, color: '#9a3412', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} />
                      Event Details
                    </h4>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#7c2d12' }}>
                      Date & Time
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#c2410c' }} />
                      <input
                        type="datetime-local"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          border: '1.5px solid #fed7aa',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#7c2d12' }}>
                      Event Location
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#c2410c' }} />
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="e.g. Auditorium"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          border: '1.5px solid #fed7aa',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#7c2d12' }}>
                      Registration Link (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#c2410c' }} />
                      <input
                        type="url"
                        value={regUrl}
                        onChange={(e) => setRegUrl(e.target.value)}
                        placeholder="https://docs.google.com/..."
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          border: '1.5px solid #fed7aa',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#7c2d12' }}>
                      Poster Image URL (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#c2410c' }} />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://imgur.com/..."
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          border: '1.5px solid #fed7aa',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                  Description / Message
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide full details about this announcement..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                    lineHeight: '1.6'
                  }}
                />
              </div>

              {/* Feedback Messages */}
              {error && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '16px',
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: '16px',
                  color: '#dc2626'
                }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {success && (
                <div style={{
                  padding: '16px',
                  background: '#f0fdf4',
                  border: '1px solid #dcfce7',
                  borderRadius: '16px',
                  color: '#16a34a',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                   <div style={{ background: '#16a34a', color: 'white', borderRadius: '50%', padding: '2px' }}><Check size={14} /></div>
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '16px',
                    background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: isSubmitting ? 'none' : '0 10px 15px -3px rgba(249, 115, 22, 0.4)'
                  }}
                >
                  {isSubmitting ? (
                    'Publishing...'
                  ) : (
                    <>
                      <Send size={18} />
                      Publish {type === 'event' ? 'Event' : 'Announcement'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default AnnouncementModal;

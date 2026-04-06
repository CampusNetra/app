import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, UploadCloud, FileText, ChevronDown, Check, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../student/student.css';

const FacultyNewAnnouncement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'normal',
    targets: [] // Array of { type: 'section' | 'department', id: number, label: string }
  });

  const [targetOptions, setTargetOptions] = useState({
    dept: null,
    sections: [],
    offerings: []
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const res = await api.get('/faculty/targets');
      setTargetOptions(res.data);
    } catch (err) {
      console.error('Failed to load targets:', err);
    }
  };

  const toggleTarget = (target) => {
    const exists = formData.targets.find(t => t.id === target.id && t.type === target.type);
    if (exists) {
      setFormData({ ...formData, targets: formData.targets.filter(t => !(t.id === target.id && t.type === target.type)) });
    } else {
      setFormData({ ...formData, targets: [...formData.targets, target] });
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Please fill in both title and content.');
      return;
    }
    if (formData.targets.length === 0) {
      setError('Please select at least one target audience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/faculty/announcements', {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        visibility: formData.targets.some(t => t.type === 'department') ? 'department' : 'section',
        targets: formData.targets.map(t => ({ type: t.type, id: t.id }))
      });

      setSuccess(true);
      setTimeout(() => navigate('/faculty/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-white">
        <header className="st-topbar px-6 border-b border-slate-50">
          <button className="st-icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">New Announcement</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-40">
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Announcement Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Enter announcement title" 
                className="w-full h-16 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Announcement Details</label>
              <textarea 
                required
                rows={6}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="Write announcement details..." 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Target Audience - Multi Select */}
            <div className="space-y-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Target Audience</label>
              <div className="relative">
                <div 
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   className="min-h-[64px] bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3 flex flex-wrap gap-2 items-center cursor-pointer hover:bg-white transition-all overflow-hidden"
                >
                   {formData.targets.length === 0 ? (
                      <span className="font-bold text-slate-300">Select audience...</span>
                   ) : (
                      formData.targets.map(t => (
                         <div key={`${t.type}-${t.id}`} className="bg-orange-50 border border-orange-100 text-orange-600 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in zoom-in duration-200">
                            <span className="text-[11px] font-black uppercase tracking-wider">{t.label}</span>
                            <X size={14} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTarget(t); }} />
                         </div>
                      ))
                   )}
                   <ChevronDown className={`ml-auto text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                </div>

                {isDropdownOpen && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[28px] shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                      <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                         {/* Branch Option */}
                         {targetOptions.dept && (
                             <button
                                onClick={() => toggleTarget({ type: 'department', id: targetOptions.dept.id, label: `Entire ${targetOptions.dept.name}` })}
                                className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-colors"
                             >
                                <div className="text-left font-black text-slate-800 text-sm">Public - Entire {targetOptions.dept.name} Branch</div>
                                {formData.targets.some(t => t.type === 'department' && t.id === targetOptions.dept.id) && <Check size={18} className="text-orange-500" />}
                             </button>
                         )}
                         <div className="h-[1px] bg-slate-50 my-1"></div>
                         {/* Sections Options */}
                         {targetOptions.sections.map(sec => (
                             <button
                                key={sec.id}
                                onClick={() => toggleTarget({ type: 'section', id: sec.id, label: sec.name })}
                                className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-colors"
                             >
                                <div className="text-left font-black text-slate-800 text-sm">Section {sec.name}</div>
                                {formData.targets.some(t => t.type === 'section' && t.id === sec.id) && <Check size={18} className="text-orange-500" />}
                             </button>
                         ))}
                      </div>
                   </div>
                )}
              </div>
            </div>

            {/* Priority Level */}
            <div className="space-y-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Priority Level</label>
              <div className="flex bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
                {[
                  { label: 'Normal', value: 'normal' },
                  { label: 'Important', value: 'important' },
                  { label: 'Event', value: 'event' }
                ].map((level) => (
                   <button
                     key={level.value}
                     type="button"
                     onClick={() => setFormData({...formData, type: level.value})}
                     className={`flex-1 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                       formData.type === level.value ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'
                     }`}
                   >
                     {level.label}
                   </button>
                ))}
              </div>
            </div>

            {/* Attachments Placeholder */}
            <div className="space-y-4">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Attachments</label>
              <div className="w-full py-12 bg-slate-50/20 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-center px-8 border-spacing-4 group">
                 <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mb-4">
                    <UploadCloud size={28} />
                 </div>
                 <p className="text-sm font-black text-slate-800">Click to upload or drag & drop</p>
              </div>
            </div>

            {error && <p className="text-rose-500 text-[11px] font-black uppercase tracking-widest text-center">{error}</p>}
          </div>
        </main>

        <footer className="p-6 bg-white border-t border-slate-50 fixed bottom-0 left-0 right-0 max-w-[450px] mx-auto z-[60]">
           <button 
             onClick={handlePublish}
             disabled={loading}
             className="w-full bg-orange-600 h-16 rounded-[24px] flex items-center justify-center gap-3 text-white font-black uppercase tracking-[2px] shadow-2xl shadow-orange-100 active:scale-[0.98] transition-all disabled:opacity-50"
           >
              {loading ? 'Publishing...' : (
                <>
                  <Send size={20} className="stroke-[3]" fill="currentColor" />
                  <span>Publish Announcement</span>
                </>
              )}
           </button>
        </footer>
      </div>

      {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>}

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6">
           <div className="text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-50/50">
                 <Send size={40} className="translate-x-1" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Announcement Sent!</h2>
              <p className="text-sm font-bold text-slate-400">Broadcasting successfully...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default FacultyNewAnnouncement;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, FileText, Calendar, UploadCloud, Send, X, CheckSquare, Square, Check, ChevronDown, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../student/student.css';

const FacultyCreateAssignment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offering_ids: [],
    offering_labels: [],
    dueDate: '',
    allowSubmission: true,
    sendNotification: true
  });

  const [targetOptions, setTargetOptions] = useState({
    dept: null,
    sections: [],
    offerings: [],
    allSubjects: []
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      console.log('[CreateAssignment] Fetching targets...');
      const res = await api.get('/faculty/targets');
      console.log('[CreateAssignment] Targets loaded:', res.data);
      setTargetOptions(res.data);
    } catch (err) {
      console.error('Failed to load targets:', err);
      setError('Could not load course data. Please check your connection.');
    }
  };

  const toggleTarget = (offeringId, label) => {
    const exists = formData.offering_ids.includes(offeringId);
    if (exists) {
      setFormData({ 
        ...formData, 
        offering_ids: formData.offering_ids.filter(id => id !== offeringId),
        offering_labels: formData.offering_labels.filter(l => l !== label)
      });
    } else {
      setFormData({ 
        ...formData, 
        offering_ids: [...formData.offering_ids, offeringId],
        offering_labels: [...formData.offering_labels, label]
      });
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.offering_ids.length === 0) {
      setError('Please fill in title and select at least one class.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/faculty/assignments', {
        title: formData.title,
        description: formData.description,
        offering_ids: formData.offering_ids,
        due_date: formData.dueDate,
        allow_submission: formData.allowSubmission
      });

      setSuccess(true);
      setTimeout(() => navigate('/faculty/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish assignment');
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
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Create Assignment</h1>
          <button className="st-icon-btn">
             <MoreHorizontal size={22} className="text-slate-500" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          <form className="space-y-8">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest pl-1">Assignment Details</h3>
            
            <div className="space-y-2">
                <label className="text-[14px] font-black text-slate-800">Title</label>
                <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Midterm Lab Report" 
                    className="w-full h-16 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[14px] font-black text-slate-800">Subject / Section</label>
                <div className="relative z-50">
                   <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="min-h-[64px] bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3 flex flex-wrap gap-2 items-center cursor-pointer hover:bg-white transition-all"
                   >
                      {formData.offering_ids.length === 0 ? (
                         <span className="font-bold text-slate-300">Select courses...</span>
                      ) : (
                         formData.offering_labels.map((label, idx) => (
                            <div key={idx} className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in zoom-in duration-200">
                               <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
                               <X size={14} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTarget(formData.offering_ids[idx], label); }} />
                            </div>
                         ))
                      )}
                      <ChevronDown className={`ml-auto text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                   </div>

                   {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[28px] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 z-[100]">
                         <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                             {targetOptions.offerings.length > 0 ? (
                                targetOptions.offerings.map(o => {
                                    const label = `${o.subject_name} – ${o.section_name}`;
                                    return (
                                       <button
                                          key={o.offering_id}
                                          type="button"
                                          onClick={() => toggleTarget(o.offering_id, label)}
                                          className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-colors"
                                       >
                                          <div className="text-left font-black text-slate-800 text-sm">{label}</div>
                                          {formData.offering_ids.includes(o.offering_id) && <Check size={18} className="text-orange-500" />}
                                       </button>
                                    );
                                })
                             ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-2xl">
                                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                      <Info size={20} className="text-slate-400" />
                                   </div>
                                   <p className="text-[13px] font-black text-slate-600 mb-1">No assigned subjects found</p>
                                   <p className="text-[11px] font-bold text-slate-400">Please contact the administrator to assign subjects to your account.</p>
                                </div>
                             )}
                         </div>
                      </div>
                   )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[14px] font-black text-slate-800">Description & Instructions</label>
                <textarea 
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide details..." 
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none resize-none leading-relaxed"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[14px] font-black text-slate-800">Due Date</label>
                <div className="relative">
                    <input 
                        type="date"
                        value={formData.dueDate}
                        onChange={e => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full h-16 bg-slate-50/50 border border-slate-100 rounded-2xl px-12 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none"
                    />
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
            </div>

            <div className="space-y-3">
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, allowSubmission: !formData.allowSubmission})}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
                >
                    {formData.allowSubmission ? <div className="text-orange-600"><CheckSquare size={22} fill="currentColor" className="opacity-10" /> <CheckSquare size={22} className="absolute -translate-y-[22px]" /></div> : <Square size={22} className="text-slate-200" />}
                    <div className="flex-1 text-left">
                       <div className="text-sm font-black text-slate-800">Allow student submission</div>
                       <div className="text-[10px] font-bold text-slate-400">Enable students to upload files</div>
                    </div>
                </button>

                <button 
                     type="button"
                     onClick={() => setFormData({...formData, sendNotification: !formData.sendNotification})}
                     className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
                >
                    {formData.sendNotification ? <div className="text-orange-600"><CheckSquare size={22} fill="currentColor" className="opacity-10" /> <CheckSquare size={22} className="absolute -translate-y-[22px]" /></div> : <Square size={22} className="text-slate-200" />}
                    <div className="flex-1 text-left">
                       <div className="text-sm font-black text-slate-800">Send notification</div>
                       <div className="text-[10px] font-bold text-slate-400">Notify all enrolled students</div>
                    </div>
                </button>
            </div>

            {error && <p className="text-rose-500 text-[11px] font-black uppercase tracking-widest text-center">{error}</p>}
          </form>
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
                  <span>Publish Assignment</span>
                </>
              )}
           </button>
        </footer>
      </div>

      {isDropdownOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)}></div>}

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6">
           <div className="text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-50/50">
                 <Check size={40} className="stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Assignment Created!</h2>
              <p className="text-sm font-bold text-slate-400">Successfully published tasks.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCreateAssignment;

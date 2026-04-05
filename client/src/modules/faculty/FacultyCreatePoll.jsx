import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Send, Check, 
  ChevronDown, X, BarChart2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../student/student.css';

const FacultyCreatePoll = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    targets: []
  });

  const [targetOptions, setTargetOptions] = useState({
    dept: null,
    sections: []
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

  const addOption = () => {
    if (formData.options.length < 5) {
      setFormData({ ...formData, options: [...formData.options, ''] });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const toggleTarget = (target) => {
    const exists = formData.targets.find(t => t.id === target.id && t.type === target.type);
    if (exists) {
      setFormData({ ...formData, targets: formData.targets.filter(t => !(t.id === target.id && t.type === target.type)) });
    } else {
      setFormData({ ...formData, targets: [...formData.targets, target] });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const validOptions = formData.options.filter(o => o.trim() !== '');
    
    if (!formData.question || validOptions.length < 2) {
      setError('Please provide a question and at least 2 options.');
      return;
    }
    if (formData.targets.length === 0) {
      setError('Please select at least one target audience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/faculty/polls', {
        question: formData.question,
        options: validOptions,
        targets: formData.targets.map(t => ({ type: t.type, id: t.id }))
      });

      setSuccess(true);
      setTimeout(() => navigate('/faculty/polls'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create poll');
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
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Create Poll</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          <div className="space-y-8">
            {/* Question */}
            <div className="space-y-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Question</label>
              <textarea 
                rows={3}
                value={formData.question}
                onChange={e => setFormData({...formData, question: e.target.value})}
                placeholder="Ask something to your students..." 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:bg-white focus:border-emerald-500 transition-all outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
               <div className="flex items-center justify-between pl-1">
                  <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest">Options</label>
                  <span className="text-[11px] font-bold text-slate-300">{formData.options.length}/5 max</span>
               </div>
               
               <div className="space-y-3">
                  {formData.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input 
                         value={option}
                         onChange={e => handleOptionChange(idx, e.target.value)}
                         placeholder={`Option ${idx + 1}`}
                         className="flex-1 h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                       />
                       {formData.options.length > 2 && (
                         <button 
                           onClick={() => removeOption(idx)}
                           className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center transition-transform active:scale-95"
                         >
                            <Trash2 size={20} />
                         </button>
                       )}
                    </div>
                  ))}
               </div>

               {formData.options.length < 5 && (
                 <button 
                   onClick={addOption}
                   className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-black text-sm flex items-center justify-center gap-2 hover:border-emerald-200 hover:text-emerald-500 transition-all"
                 >
                    <Plus size={18} />
                    <span>Add Another Option</span>
                 </button>
               )}
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Target Audience</label>
              <div className="relative z-50">
                <div 
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   className="min-h-[64px] bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-3 flex flex-wrap gap-2 items-center cursor-pointer hover:bg-white transition-all overflow-hidden"
                >
                   {formData.targets.length === 0 ? (
                      <span className="font-bold text-slate-300">Select audience...</span>
                   ) : (
                      formData.targets.map(t => (
                         <div key={`${t.type}-${t.id}`} className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in zoom-in duration-200">
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
                         {targetOptions.dept && (
                             <button
                                onClick={() => toggleTarget({ type: 'department', id: targetOptions.dept.id, label: `Entire ${targetOptions.dept.name}` })}
                                className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-colors"
                             >
                                <div className="text-left font-black text-slate-800 text-sm">Entire Branch</div>
                                {formData.targets.some(t => t.type === 'department' && t.id === targetOptions.dept.id) && <Check size={18} className="text-emerald-500" />}
                             </button>
                         )}
                         <div className="h-[1px] bg-slate-50 my-1"></div>
                         {targetOptions.sections.map(sec => (
                             <button
                                key={sec.id}
                                onClick={() => toggleTarget({ type: 'section', id: sec.id, label: sec.name })}
                                className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-colors"
                             >
                                <div className="text-left font-black text-slate-800 text-sm">Section {sec.name}</div>
                                {formData.targets.some(t => t.type === 'section' && t.id === sec.id) && <Check size={18} className="text-emerald-500" />}
                             </button>
                         ))}
                      </div>
                   </div>
                )}
              </div>
            </div>

            {error && <p className="text-rose-500 text-[11px] font-black uppercase tracking-widest text-center">{error}</p>}
          </div>
        </main>

        <footer className="p-6 bg-white border-t border-slate-50 fixed bottom-0 left-0 right-0 max-w-[450px] mx-auto z-[60]">
           <button 
             onClick={handleCreate}
             disabled={loading}
             className="w-full bg-emerald-600 h-16 rounded-[24px] flex items-center justify-center gap-3 text-white font-black uppercase tracking-[2px] shadow-2xl shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-50"
           >
              {loading ? 'Starting Poll...' : (
                <>
                  <BarChart2 size={20} className="stroke-[3]" fill="currentColor" />
                  <span>Start Live Poll</span>
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
                 <Check size={40} className="stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Poll Started!</h2>
              <p className="text-sm font-bold text-slate-400">Successfully published live poll.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCreatePoll;

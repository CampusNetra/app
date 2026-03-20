import React, { useState, useEffect } from 'react';
import { BookOpen, UserCheck, Calendar, X, Loader2, Save } from 'lucide-react';
import api from '../../../api'; // Adjusted Import path

const EditAssignmentModal = ({ isOpen, onClose, onUpdate, assignment, subjects, sections, terms, faculty }) => {
  const [formData, setFormData] = useState({
    facultyId: '',
    sectionId: '',
    subjectId: '',
    termId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
        facultyId: assignment.faculty_id || '',
        sectionId: assignment.section_id || '',
        subjectId: assignment.subject_id || '',
        termId: assignment.term_id || ''
      });
    }
  }, [assignment]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(assignment.id, {
        faculty_id: Number(formData.facultyId),
        section_id: Number(formData.sectionId),
        subject_id: Number(formData.subjectId),
        term_id: Number(formData.termId)
      });
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Modify Assignment</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Resource Realignment Hub</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center active:scale-95 shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <UserCheck size={14} className="text-primary" /> Faculty Link
              </label>
              <select 
                required
                value={formData.facultyId}
                onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {faculty.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 opacity-50 pointer-events-none">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <BookOpen size={14} /> Subject Context
              </label>
              <select 
                disabled
                value={formData.subjectId}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-500 appearance-none"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={14} className="text-orange-500" /> Allocated Section
              </label>
              <select 
                required
                value={formData.sectionId}
                onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={14} className="text-rose-500" /> Academic Term
              </label>
              <select 
                required
                value={formData.termId}
                onChange={(e) => setFormData({...formData, termId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {terms.map(t => (
                  <option key={t.id} value={t.id}>{t.name} {t.is_active ? '(ACTIVE)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-50">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-5 rounded-[1.5rem] border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all font-sans"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-5 rounded-[1.5rem] bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 font-sans"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Apply Transformation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentModal;

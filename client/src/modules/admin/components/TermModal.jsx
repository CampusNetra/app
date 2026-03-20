import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';

const TermModal = ({ isOpen, onClose, onSubmit, loading, term = null }) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (term) {
      setName(term.name || '');
      setIsActive(!!term.is_active);
    } else {
      setName('');
      setIsActive(false);
    }
  }, [term, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim().toUpperCase(), is_active: isActive });
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {term ? 'Edit Term' : 'Add Term'}
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
              {term ? 'Modify academic term details' : 'Define a new academic term'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center active:scale-95 group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Term Name</label>
              <div className="relative group">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-base font-bold transition-all placeholder:text-slate-300 shadow-inner"
                  placeholder="e.g. 2024_FALL"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
                Set as active term
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 rounded-2xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-[2] py-5 rounded-2xl bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                term ? 'Save Changes' : 'Create Term'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TermModal;

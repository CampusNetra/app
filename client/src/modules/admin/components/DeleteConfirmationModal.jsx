import React from 'react';
import { Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex justify-end">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-10 pt-4 space-y-6 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto shadow-sm">
            <Trash2 size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-sans"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl bg-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-500/25 hover:bg-rose-600 transition-all font-sans flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

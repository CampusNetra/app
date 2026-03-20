import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle2, Circle, Search, RefreshCw, Trash2, Edit3, Loader2 } from 'lucide-react';
import api from '../../api';
import TermModal from './components/TermModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

const TermManager = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [termToEdit, setTermToEdit] = useState(null);
    const [termToDelete, setTermToDelete] = useState(null);

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/terms');
            setTerms(res.data);
        } catch (err) {
            setError('Failed to fetch terms');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (data) => {
        setSubmitting(true);
        setError('');
        try {
            if (termToEdit) {
                await api.put(`/terms/${termToEdit.id}`, data);
                setTermToEdit(null);
            } else {
                await api.post('/terms', data);
                setIsModalOpen(false);
            }
            fetchTerms();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTerm = async () => {
        if (!termToDelete) return;
        setDeleting(true);
        setError('');
        try {
            await api.delete(`/terms/${termToDelete.id}`);
            setTerms(terms.filter(t => t.id !== termToDelete.id));
            setTermToDelete(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete term');
        } finally {
            setDeleting(false);
        }
    };

    const handleActivateTerm = async (id) => {
        try {
            await api.patch(`/terms/${id}/activate`);
            setTerms(terms.map(t => ({
                ...t,
                is_active: t.id === Number(id) ? 1 : 0
            })));
        } catch (err) {
            setError('Failed to activate term');
        }
    };

    const filteredTerms = terms.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex-1">
                   <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2">Academic Terms</h2>
                   <p className="text-slate-500 font-medium">Manage the active semesters for your department.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-black shadow-xl shadow-primary/25 hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 active:scale-95 transition-all transition-transform tracking-tight"
                    >
                        <Plus size={18} />
                        New Term
                    </button>
                    <button 
                        onClick={fetchTerms}
                        className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-sm font-black hover:bg-white transiton-all bg-white/50 shadow-sm text-slate-600 active:scale-95"
                    >
                        <RefreshCw size={18} className={loading && terms.length > 0 ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Improved Search */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="relative">
                    <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search academic terms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] bg-transparent outline-none text-base font-bold text-slate-700 placeholder:text-slate-300"
                    />
                </div>
            </div>

            {error && (
                <div className="p-6 rounded-3xl border border-rose-100 bg-rose-50 text-sm font-black text-rose-600 uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {loading && terms.length === 0 ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-32 rounded-[2.5rem] bg-white border border-slate-100 animate-pulse shadow-sm" />
                    ))
                ) : filteredTerms.length > 0 ? (
                    filteredTerms.map(term => (
                        <div 
                            key={term.id} 
                            className={`group flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                                term.is_active 
                                ? 'bg-orange-50/50 border-orange-200 ring-4 ring-orange-50' 
                                : 'bg-white border-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                    term.is_active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/40 rotate-12' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                                }`}>
                                    <Calendar size={28} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{term.name}</h3>
                                        {term.is_active ? (
                                             <span className="px-3 py-1 bg-white/50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100 shadow-sm flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                                Current Term
                                             </span>
                                        ) : null}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created {new Date(term.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {!term.is_active && (
                                    <button 
                                        onClick={() => handleActivateTerm(term.id)}
                                        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-slate-800 hover:text-slate-900 transition-all active:scale-95 shadow-sm"
                                    >
                                        <Circle size={14} />
                                        Activate
                                    </button>
                                )}
                                <div className="flex items-center gap-2 ml-4">
                                    <button 
                                        onClick={() => setTermToEdit(term)}
                                        className="p-3.5 rounded-xl border border-slate-100 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                    <button 
                                        onClick={() => setTermToDelete(term)}
                                        className="p-3.5 rounded-xl border border-slate-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 border-2 border-slate-100 transition-transform hover:rotate-12">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Terms Found</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Add your first academic term to get started.</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                        >
                            <Plus size={18} />
                            Create Term
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <TermModal 
                isOpen={isModalOpen || !!termToEdit}
                onClose={() => { setIsModalOpen(false); setTermToEdit(null); }}
                onSubmit={handleCreateOrUpdate}
                loading={submitting}
                term={termToEdit}
            />

            <DeleteConfirmationModal 
                isOpen={!!termToDelete}
                onClose={() => setTermToDelete(null)}
                onConfirm={handleDeleteTerm}
                loading={deleting}
                title="Delete Term"
                message={`This will permanently remove "${termToDelete?.name}". Active terms cannot be deleted.`}
            />
        </div>
    );
};

export default TermManager;

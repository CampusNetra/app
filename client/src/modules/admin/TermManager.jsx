import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle2, Circle, Search, ArrowRight, Trash2 } from 'lucide-react';
import api from '../../api';

const TermManager = () => {
    const [terms, setTerms] = useState([]);
    const [newTerm, setNewTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const res = await api.get('/terms');
            setTerms(res.data);
        } catch (err) {
            setError('Failed to fetch terms');
        }
    };

    const handleCreateTerm = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/terms', { 
                name: newTerm.trim().toUpperCase()
            });
            setTerms([res.data, ...terms]);
            setNewTerm('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create term');
        } finally {
            setLoading(false);
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

    return (
        <div className="p-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 pb-2 border-b border-slate-100">
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Academic Term</label>
                    <form onSubmit={handleCreateTerm} className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors">
                            <Plus size={18} />
                        </div>
                        <input
                            type="text"
                            value={newTerm}
                            onChange={(e) => setNewTerm(e.target.value)}
                            placeholder="e.g. 2024_WINTER (Term Name)"
                            required
                            className="w-full pl-12 pr-40 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-black placeholder:uppercase"
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !newTerm.trim()} 
                            className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? 'Adding...' : 'Add Account Term'}
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-sm font-black text-rose-600 animate-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Available Terms</h3>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">{terms.length} Total</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {terms.map(term => (
                        <div 
                            key={term.id} 
                            className={`flex items-center justify-between p-6 rounded-3xl border transition-all hover:translate-x-1 group ${
                                term.is_active 
                                ? 'bg-orange-50/50 border-orange-100 ring-2 ring-orange-50' 
                                : 'bg-white border-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                    term.is_active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                                }`}>
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">{term.name}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Created on {new Date(term.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {term.is_active ? (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-200 shadow-sm">
                                        <CheckCircle2 size={14} />
                                        <span>Current Active</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleActivateTerm(term.id)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-display"
                                    >
                                        <Circle size={14} />
                                        <span>Set as Active</span>
                                    </button>
                                )}
                                <button className="p-3 rounded-xl border border-slate-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all hover:border-rose-100">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {terms.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                             <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                                 <Calendar size={32} />
                             </div>
                             <p className="text-slate-400 font-bold">No academic terms defined yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermManager;

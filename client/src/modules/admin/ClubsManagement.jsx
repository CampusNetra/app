import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Trophy, 
  Music, 
  Code, 
  Palette, 
  Camera, 
  Coffee, 
  Globe, 
  Trash2, 
  Edit3, 
  MessageCircle,
  Hash,
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';
import api from '../../api';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import ClubModal from './components/ClubModal';

const ClubsManagement = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clubToEdit, setClubToEdit] = useState(null);
    const [clubToDelete, setClubToDelete] = useState(null);

    const categories = [
        { id: 'tech', label: 'Technical', icon: Code, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'arts', label: 'Cultural & Arts', icon: Palette, color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'sports', label: 'Sports', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'music', label: 'Music', icon: Music, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'hobby', label: 'Hobby', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'social', label: 'Social', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/admin/clubs');
            setClubs(res.data || []);
        } catch (err) {
            console.error('Error fetching clubs:', err);
            setClubs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveClub = async (data) => {
        setSubmitting(true);
        try {
            if (clubToEdit) {
                await api.put(`/admin/clubs/${clubToEdit.id}`, data);
            } else {
                await api.post('/admin/clubs', data);
            }
            fetchClubs();
            setIsModalOpen(false);
            setClubToEdit(null);
        } catch (err) {
            setError('Failed to save club');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClub = async () => {
        if (!clubToDelete) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/clubs/${clubToDelete.id}`);
            setClubs(clubs.filter(c => c.id !== clubToDelete.id));
            setClubToDelete(null);
        } catch (err) {
            setError('Failed to delete club');
        } finally {
            setDeleting(false);
        }
    };

    const filteredClubs = clubs.filter(c => 
        (activeFilter === 'all' || c.category === activeFilter) &&
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         c.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getCategoryDetails = (catId) => {
        return categories.find(c => c.id === catId) || { icon: Users, color: 'text-slate-500', bg: 'bg-slate-50', label: 'Other' };
    };

    return (
        <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-8 max-w-7xl mx-auto custom-scrollbar">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 pb-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Clubs & Communities</h1>
                        <p className="text-slate-500 font-medium mt-1">Nurture campus life by managing interest-based student organizations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchClubs}
                            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary transition-all shadow-sm active:scale-95"
                            title="Refresh"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:translate-y-[-2px] active:translate-y-0 transition-all uppercase tracking-widest"
                        >
                            <Plus size={18} />
                            Establish Club
                        </button>
                    </div>
                </div>

                {/* Search - simplified without categories */}
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Find a club or community..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white border border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-base font-bold text-slate-700 shadow-sm transition-all"
                    />
                </div>

                {/* Clubs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {loading && filteredClubs.length === 0 ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 rounded-[3rem] bg-white border border-slate-100 animate-pulse shadow-sm" />
                        ))
                    ) : filteredClubs.length > 0 ? (
                        filteredClubs.map(club => {
                            const cat = getCategoryDetails(club.category);
                            return (
                                <div 
                                    key={club.id}
                                    className="group relative bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 p-8 flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 border border-indigo-100/50">
                                            <Users size={28} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setClubToEdit(club);
                                                    setIsModalOpen(true);
                                                }}
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center active:scale-90"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => setClubToDelete(club)}
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{club.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                            {club.description || 'No description provided for this campus community group.'}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                <Hash size={14} />
                                            </div>
                                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{club.channel_name || 'No Channel'}</span>
                                        </div>
                                        <button className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">
                                            View Details
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    
                                    {/* Glass Accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 border-2 border-slate-100">
                                <Users size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Communities Found</h3>
                            <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Start a new chapter on campus by establishing the first student club.</p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="mt-8 px-10 py-5 rounded-3xl bg-slate-900 text-white text-sm font-black shadow-2xl active:scale-95 transition-all"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ClubModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setClubToEdit(null);
                }}
                onSave={handleSaveClub}
                club={clubToEdit}
                loading={submitting}
            />

            <DeleteConfirmationModal 
                isOpen={!!clubToDelete}
                onClose={() => setClubToDelete(null)}
                onConfirm={handleDeleteClub}
                loading={deleting}
                title="Disband Club"
                message={`Are you sure you want to permanently disband "${clubToDelete?.name}"? This will also archive its communication channel.`}
            />
        </div>
    );
};

export default ClubsManagement;

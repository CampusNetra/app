import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Type, 
  AlignLeft, 
  Tag, 
  Plus, 
  Code, 
  Palette, 
  Trophy, 
  Music, 
  Camera, 
  Globe,
  Loader2
} from 'lucide-react';

const ClubModal = ({ isOpen, onClose, onSave, club = null, loading = false }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('tech');

    useEffect(() => {
        if (club) {
            setName(club.name || '');
            setDescription(club.description || '');
            setCategory(club.category || 'tech');
        } else {
            setName('');
            setDescription('');
            setCategory('tech');
        }
    }, [club, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, category });
    };

    const categories = [
        { id: 'tech', label: 'Technical', icon: Code },
        { id: 'arts', label: 'Cultural & Arts', icon: Palette },
        { id: 'sports', label: 'Sports', icon: Trophy },
        { id: 'music', label: 'Music', icon: Music },
        { id: 'hobby', label: 'Hobby', icon: Camera },
        { id: 'social', label: 'Social', icon: Globe },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative p-10 pb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {club ? 'Modify Club' : 'Establish Club'}
                            </h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-100 active:scale-90"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-slate-400 font-medium">Define the core identity of this student community.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-8">
                    <div className="space-y-6">
                        {/* Club Name */}
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">
                                <Type size={14} />
                                Club Name
                            </label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                placeholder="e.g. Robotics Innovation Core"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                <Tag size={14} />
                                Interest Category
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${category === cat.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                    >
                                        <cat.icon size={16} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">
                                <AlignLeft size={14} />
                                Mission Statement
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300 min-h-[120px] resize-none"
                                placeholder="Describe the club's purpose and upcoming activities..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-5 rounded-3xl bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all outline-none"
                        >
                            Abandon
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] flex items-center justify-center gap-2 px-8 py-5 rounded-3xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none hover:translate-y-[-2px] active:translate-y-0"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                            {club ? 'Update Status' : 'Establish Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClubModal;

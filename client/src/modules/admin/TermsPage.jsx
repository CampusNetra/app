import React from 'react';
import TermManager from './TermManager';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 bg-slate-50/50 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <button 
                                onClick={() => navigate('/admin/dashboard')}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center active:scale-95 shadow-sm group"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Terms</h1>
                        </div>
                        <p className="text-slate-500 font-medium font-sans">Define and manage the active semesters for your department.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-10">
                    <TermManager />
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

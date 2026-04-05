import React, { useState, useEffect } from 'react';
import { 
  Plus, UploadCloud, Search, Filter, 
  ChevronRight, FileText, Menu, Info, Layers, MoreVertical, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FacultyDrawer from './FacultyDrawer';
import api from '../../api';
import '../student/student.css';

const FacultyMaterials = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
    setTimeout(() => setLoading(false), 800); // Simulate load for dummy page
  }, []);

  const fetchData = async () => {
    try {
      const authRes = await api.get('/faculty/dashboard');
      setFaculty(authRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const dummyMaterials = [
    { name: 'Lecture_Notes_Unit1.pdf', size: '2.4 MB', date: 'Oct 24, 2023', type: 'PDF' },
    { name: 'Practical_Guidelines.docx', size: '1.1 MB', date: 'Oct 21, 2023', type: 'DOC' },
    { name: 'Project_Templates.zip', size: '15.8 MB', date: 'Oct 18, 2023', type: 'ZIP' },
  ];

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/50">
        <header className="st-topbar px-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-[90]">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm">CN</div>
             <h1 className="text-[18px] font-black text-slate-800 tracking-tighter">CampusNetra</h1>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2.5 text-slate-400 hover:text-purple-600 transition-colors relative">
                <Bell size={22} strokeWidth={2.5} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={24} strokeWidth={2.5} />
             </button>
          </div>
        </header>

        <FacultyDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          {/* Header Title in Main */}
          <section className="mb-8">
             <h2 className="text-[28px] font-black leading-tight text-slate-800">
                Academic <span className="text-purple-600">Materials</span>
             </h2>
             <p className="text-[14px] font-bold text-slate-400 mt-1">Upload and manage shared resources.</p>
          </section>

          {/* Search bar */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   placeholder="Search materials..." 
                   className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-sm text-slate-800 outline-none focus:border-purple-500 transition-all shadow-sm"
                />
            </div>
            <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                <Filter size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
                [1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : (
               dummyMaterials.map((mat, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm group active:scale-[0.98] transition-all">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                           <FileText size={24} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-[15px] font-black text-slate-800 truncate mb-0.5">{mat.name}</h4>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{mat.type} • {mat.size}</p>
                        </div>
                        <button className="text-slate-300">
                           <MoreVertical size={20} />
                        </button>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Info size={12} />
                           <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden truncate max-w-[150px]">Shared with: MCA-Section 4</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{mat.date}</span>
                     </div>
                  </div>
               ))
            )}
            
            {/* Empty state hint */}
            <div className="mt-8 p-6 bg-purple-50/50 rounded-[32px] border border-dashed border-purple-100 text-center">
               <UploadCloud size={24} className="text-purple-400 mx-auto mb-3" />
               <p className="text-[12px] font-bold text-purple-600">Need to share more?</p>
               <button className="text-[11px] font-black uppercase tracking-widest text-purple-800 mt-1">Tap to Upload</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyMaterials;

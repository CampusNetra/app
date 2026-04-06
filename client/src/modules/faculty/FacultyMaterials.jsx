import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Search,
  FileText,
  Menu,
  Bell,
  Link as LinkIcon,
  BookOpen
} from 'lucide-react';
import FacultyDrawer from './FacultyDrawer';
import FacultyDock from './FacultyDock';
import api from '../../api';
import '../student/student.css';

const getFileName = (url = '') => {
  try {
    return decodeURIComponent(url.split('/').pop() || 'attachment');
  } catch {
    return 'attachment';
  }
};

const getExtension = (url = '') => {
  const fileName = getFileName(url);
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
};

const FacultyMaterials = () => {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, assignmentsRes, subjectsRes] = await Promise.all([
        api.get('/faculty/dashboard'),
        api.get('/faculty/assignments'),
        api.get('/faculty/subjects')
      ]);

      setFaculty(profileRes.data.profile);
      setSubjects(subjectsRes.data);

      const attachmentBackedMaterials = assignmentsRes.data
        .filter((assignment) => assignment.attachment_url)
        .map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          url: assignment.attachment_url,
          file_name: getFileName(assignment.attachment_url),
          file_type: getExtension(assignment.attachment_url),
          created_at: assignment.created_at,
          subjects: assignment.subjects,
          sections: assignment.sections
        }));

      setMaterials(attachmentBackedMaterials);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const haystack = [
      material.title,
      material.file_name,
      material.subjects,
      material.sections,
      material.file_type
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/50">
        <header className="st-topbar px-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-[90]">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">CN</div>
             <h1 className="text-[18px] font-semibold text-slate-800 tracking-tight">CampusNetra</h1>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2.5 text-slate-400 hover:text-orange-600 transition-colors relative">
                <Bell size={22} strokeWidth={2.25} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={24} strokeWidth={2.25} />
             </button>
          </div>
        </header>

        <FacultyDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          <section className="mb-6">
             <h2 className="text-[28px] font-semibold leading-tight text-slate-800">
                Academic <span className="text-orange-600">Materials</span>
             </h2>
             <p className="text-[14px] font-medium text-slate-400 mt-1">Showing attachment-backed materials linked through your real assignments.</p>
          </section>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-3">
                   <UploadCloud size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">{materials.length}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Linked Files</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                   <BookOpen size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">{subjects.length}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Subject Slots</div>
             </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search attached materials..."
              className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-medium text-sm text-slate-800 outline-none focus:border-orange-400 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-36 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : filteredMaterials.length > 0 ? (
               filteredMaterials.map((material) => (
                  <div key={material.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm active:scale-[0.98] transition-all">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                           <FileText size={24} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-[15px] font-semibold text-slate-800 truncate mb-1">{material.file_name}</h4>
                           <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                             {material.file_type} {material.subjects ? `· ${material.subjects}` : ''}
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                           <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Assignment</p>
                           <p className="text-[13px] font-medium text-slate-800">{material.title}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                           <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Sections</p>
                           <p className="text-[13px] font-medium text-slate-800">{material.sections || 'General'}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-3">
                        <div className="flex items-center gap-2 text-slate-400 min-w-0">
                           <LinkIcon size={13} strokeWidth={2.2} />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.14em] truncate">Attachment linked in DB</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {new Date(material.created_at).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
               ))
            ) : (
               <div className="py-16 text-center rounded-[32px] bg-white border border-dashed border-slate-200">
                  <UploadCloud size={28} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-[17px] font-semibold text-slate-800 mb-2">No stored material records yet</h3>
                  <p className="text-[13px] font-medium text-slate-400 max-w-[240px] mx-auto">
                    There is no dedicated materials table right now, so this page shows assignment attachments when they exist.
                  </p>
               </div>
            )}
          </div>
        </main>

        <FacultyDock active="" />
      </div>
    </div>
  );
};

export default FacultyMaterials;

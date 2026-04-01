import React, { useEffect, useState } from 'react';
import { RefreshCw, Plus, BookOpen, Search, ChevronRight, Trash2, Edit3, Loader2 } from 'lucide-react';
import api from '../../api';
import SubjectModal from './components/SubjectModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import SubjectAnalyticsModal from './components/SubjectAnalyticsModal';

const SubjectsManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [analyticsSubject, setAnalyticsSubject] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [creatingChannels, setCreatingChannels] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/subjects');
      setSubjects(res.data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (name) => {
    setCreating(true);
    try {
      if (subjectToEdit) {
        await api.put(`/admin/subjects/${subjectToEdit.id}`, { name });
        setSubjectToEdit(null);
      } else {
        await api.post('/admin/subjects', { name });
        setIsAddModalOpen(false);
      }
      fetchSubjects();
    } catch (err) {
      console.error('Error saving subject:', err);
      setError(err.response?.data?.error || 'Operation failed.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/subjects/${subjectToDelete.id}`);
      setSubjects(subjects.filter(s => s.id !== subjectToDelete.id));
      setSubjectToDelete(null);
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError(err.response?.data?.error || 'Failed to delete subject. Possibly in use.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openAnalytics = async (subject) => {
    setAnalyticsSubject(subject);
    setAnalyticsData(null);
    setAnalyticsError('');
    setAnalyticsLoading(true);
    try {
      const res = await api.get(`/admin/subjects/${subject.id}/analytics`);
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Error fetching subject analytics:', err);
      setAnalyticsError(err.response?.data?.error || 'Failed to load subject analytics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const closeAnalytics = () => {
    setAnalyticsSubject(null);
    setAnalyticsData(null);
    setAnalyticsError('');
    setCreatingChannels(false);
  };

  const handleCreateChannels = async () => {
    if (!analyticsSubject) return;
    setCreatingChannels(true);
    setAnalyticsError('');
    try {
      await api.post(`/admin/subjects/${analyticsSubject.id}/create-channels`);
      const analyticsRes = await api.get(`/admin/subjects/${analyticsSubject.id}/analytics`);
      setAnalyticsData(analyticsRes.data);
      setError('');
    } catch (err) {
      console.error('Error creating subject channels:', err);
      setAnalyticsError(err.response?.data?.error || 'Failed to create subject channels.');
    } finally {
      setCreatingChannels(false);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 bg-slate-50/50 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Subjects</h1>
            <p className="text-slate-500 font-medium">Manage subjects and course data.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ff6129] hover:bg-[#ff5110] text-white text-sm font-black transition-all shadow-xl shadow-orange-500/25 active:scale-95"
            >
              <Plus size={18} />
              Add Subject
            </button>
            <button
              onClick={fetchSubjects}
              className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-sm font-black hover:bg-white transiton-all bg-white/50 shadow-sm text-slate-600 active:scale-95"
            >
              <RefreshCw size={18} className={loading && subjects.length > 0 ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
           <div className="relative">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors" />
              <input 
                type="text"
                placeholder="Search subjects..."
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

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {loading && subjects.length === 0 ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 rounded-[2.5rem] bg-white border border-slate-100 animate-pulse" />
            ))
          ) : filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <div key={subject.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ff6129] group-hover:bg-[#ff6129] group-hover:text-white transition-all duration-500 border border-orange-500/10 shadow-sm">
                    <BookOpen size={28} />
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => setSubjectToEdit(subject)}
                       className="p-2.5 rounded-xl border border-slate-50 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                      >
                        <Edit3 size={18} />
                     </button>
                     <button 
                       onClick={() => setSubjectToDelete(subject)}
                       className="p-2.5 rounded-xl border border-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                      >
                        <Trash2 size={18} />
                     </button>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-500 transition-colors truncate tracking-tighter mb-1">{subject.name}</h3>
                  <div className="flex items-center gap-3">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID: #{subject.id}</span>
                     {subject.dept_name && (
                       <>
                         <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                         <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest truncate">{subject.dept_name}</span>
                       </>
                     )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-50 relative z-10">
                   <button
                     onClick={() => openAnalytics(subject)}
                     className="flex items-center gap-2 text-[11px] font-black text-[#ff6129] uppercase tracking-widest hover:translate-x-1 transition-transform"
                   >
                      View Analytics
                      <ChevronRight size={14} />
                   </button>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active</span>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 transition-transform hover:rotate-12">
                <BookOpen size={40} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Subjects</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Initialize your department's academic foundation by adding your first subject.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                <Plus size={18} />
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      <SubjectModal 
        isOpen={isAddModalOpen || !!subjectToEdit}
        onClose={() => { setIsAddModalOpen(false); setSubjectToEdit(null); }}
        onSubmit={handleCreateOrUpdate}
        creating={creating}
        subject={subjectToEdit}
      />

      <DeleteConfirmationModal 
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleDeleteSubject}
        loading={isDeleting}
        title="Delete Subject"
        message={`This will permanently remove "${subjectToDelete?.name}". This action cannot be undone.`}
      />

      <SubjectAnalyticsModal
        isOpen={!!analyticsSubject}
        onClose={closeAnalytics}
        loading={analyticsLoading}
        creatingChannels={creatingChannels}
        analytics={analyticsData}
        error={analyticsError}
        onCreateChannels={handleCreateChannels}
      />
    </div>
  );
};

export default SubjectsManagement;

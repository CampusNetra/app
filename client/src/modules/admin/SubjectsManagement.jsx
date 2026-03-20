import React, { useEffect, useState } from 'react';
import { RefreshCw, Plus, BookOpen, Search, Filter } from 'lucide-react';
import api from '../../api';

const SubjectsManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setCreating(true);
    try {
      await api.post('/admin/subjects', { name: newSubjectName.trim() });
      setNewSubjectName('');
      setIsAddModalOpen(false);
      fetchSubjects();
    } catch (err) {
      console.error('Error creating subject:', err);
      alert(err.response?.data?.error || 'Failed to create subject');
    } finally {
      setCreating(false);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subjects</h1>
          <p className="text-slate-500 mt-1">Manage core academic subjects and curriculum master data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            <Plus size={16} />
            Add Subject
          </button>
          <button
            onClick={fetchSubjects}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
         </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && subjects.length === 0 ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
          ))
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <div key={subject.id} className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4 border border-primary/10">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{subject.name}</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Subject ID: #{subject.id}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <button className="text-xs font-bold text-primary hover:underline">View Analytics</button>
                 <div className="flex items-center gap-1 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-bold">Active</span>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <BookOpen size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No subjects found</h3>
            <p className="text-slate-500">Add the subjects taught in your department.</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[1400] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div>
                 <h3 className="text-xl font-bold text-slate-900">Add New Subject</h3>
                 <p className="text-xs text-slate-500 mt-0.5">Define a new course/subject entry</p>
               </div>
               <button 
                 onClick={() => setIsAddModalOpen(false)}
                 className="h-10 w-10 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white flex items-center justify-center transition-all shadow-sm"
                >
                 <Plus className="rotate-45" size={24} />
               </button>
            </div>
            <form onSubmit={handleCreateSubject} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="e.g. Database Management Systems, etc."
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all font-display"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newSubjectName.trim()}
                  className="px-8 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;

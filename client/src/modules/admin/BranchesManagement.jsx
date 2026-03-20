import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Plus, Building2, Calendar, BookOpen, Layers, X, ChevronRight, UserSquare2, Loader2 } from 'lucide-react';
import api from '../../api';
import SubjectModal from './components/SubjectModal';

const BranchesManagement = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Detail Drawer State
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDetails, setBranchDetails] = useState({ sections: [], subjects: [] });
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/departments');
      setBranches(res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchDetails = async (branch) => {
    setSelectedBranch(branch);
    setLoadingDetails(true);
    try {
      // Assuming sections can be filtered by dept_id via query
      const [secRes, subjRes] = await Promise.all([
        api.get(`/admin/sections`, { params: { dept_id: branch.id } }),
        api.get(`/admin/subjects`, { params: { dept_id: branch.id } })
      ]);
      setBranchDetails({
        sections: secRes.data || [],
        subjects: subjRes.data || []
      });
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    setCreating(true);
    try {
      await api.post('/admin/departments', { name: newBranchName.trim() });
      setNewBranchName('');
      setIsAddModalOpen(false);
      fetchBranches();
    } catch (err) {
      console.error('Error creating branch:', err);
      alert(err.response?.data?.error || 'Failed to create branch');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const [submittingSubject, setSubmittingSubject] = useState(false);

  const handleAddSubject = async (subjectName) => {
    setSubmittingSubject(true);
    try {
      await api.post('/admin/subjects', { name: subjectName, dept_id: selectedBranch.id });
      setIsSubjectModalOpen(false);
      // Refresh details
      await fetchBranchDetails(selectedBranch);
    } catch (err) {
      console.error('Error adding subject:', err);
      alert(err.response?.data?.error || 'Failed to add subject');
    } finally {
      setSubmittingSubject(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            {isSuperAdmin ? 'Departments' : 'My Department'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isSuperAdmin ? 'Manage academic departments.' : 'Overview of your department.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus size={18} />
              Add Department
            </button>
          )}
          <button
            onClick={fetchBranches}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all bg-white shadow-sm text-slate-600"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 animate-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && branches.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-56 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          ))
        ) : branches.length > 0 ? (
          branches.map((branch) => (
            <div key={branch.id} className="group bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-primary/5">
                  <Building2 size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-100">
                  ID: #{branch.id}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">{branch.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium">
                <Calendar size={14} />
                <span>Established {formatDate(branch.created_at)}</span>
              </div>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                      <UserSquare2 size={16} />
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer">
                    +
                  </div>
                </div>
                <button 
                  onClick={() => fetchBranchDetails(branch)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all active:scale-95"
                >
                   Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100 animate-bounce">
              <Building2 size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">No departments found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">Add your first academic department to get started.</p>
          </div>
        )}
      </div>

      {/* Branch Detail Side Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[1500] transition-all duration-500 transform ${selectedBranch ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedBranch && (
          <div className="h-full flex flex-col">
            <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">{selectedBranch.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedBranch(null)}
                className="w-12 h-12 rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white flex items-center justify-center transition-all bg-white shadow-sm group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Sections Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={20} className="text-primary" />
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sections</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    {branchDetails.sections.length} Listed
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {loadingDetails ? (
                    [1, 2].map(i => <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />)
                  ) : branchDetails.sections.length > 0 ? (
                    branchDetails.sections.map(section => (
                      <div 
                        key={section.id} 
                        onClick={() => navigate('/admin/sections')}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary group-hover:text-white transition-all">
                            {section.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{section.name}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                      <p className="text-sm text-slate-400 font-medium">No sections found for this branch.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Subjects Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Subjects</h4>
                  </div>
                  <button 
                    onClick={() => setIsSubjectModalOpen(true)}
                    disabled={submittingSubject}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    {submittingSubject ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Add Subject
                  </button>
                </div>
                
                <div className="space-y-3">
                  {loadingDetails ? (
                    [1, 2, 3].map(i => <div key={i} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />)
                  ) : branchDetails.subjects.length > 0 ? (
                    branchDetails.subjects.map(subject => (
                      <div key={subject.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-white shadow-sm hover:shadow-lg hover:-translate-x-1 transition-all group cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <BookOpen size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{subject.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                      <p className="text-sm text-slate-400 font-medium font-sans">No subjects assigned yet.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-slate-50/30">
              <button 
                onClick={() => setSelectedBranch(null)}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                Done Previewing
              </button>
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div>
                 <h3 className="text-2xl font-bold text-slate-900 font-display">New Branch</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 opacity-60">Identity Creation</p>
               </div>
               <button 
                 onClick={() => setIsAddModalOpen(false)}
                 className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-all shadow-sm flex items-center justify-center active:scale-95"
                >
                 <X size={20} />
               </button>
            </div>
            <form onSubmit={handleCreateBranch} className="p-10 space-y-8">
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Department Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-base font-medium transition-all placeholder:text-slate-400 shadow-inner"
                  placeholder="e.g. Computer Science"
                />
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={creating || !newBranchName.trim()}
                  className="w-full py-4 rounded-2xl bg-primary text-white text-base font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y(0) active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {creating ? 'Creating...' : 'Create Department'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full py-4 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-800 transition-all underline underline-offset-4"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SubjectModal 
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSubmit={handleAddSubject}
        creating={submittingSubject}
      />
    </div>
  );
};

export default BranchesManagement;

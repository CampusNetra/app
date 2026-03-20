import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  BookOpen, 
  Layers, 
  Calendar, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  UserSquare2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import EditAssignmentModal from './components/EditAssignmentModal';

const FacultyAssignment = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacultyGroup, setSelectedFacultyGroup] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    facultyId: '',
    sectionId: '',
    subjectId: '',
    termId: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [assRes, facRes, subRes, secRes, termRes] = await Promise.all([
        api.get('/admin/offerings'),
        api.get('/admin/faculty'),
        api.get('/admin/subjects'),
        api.get('/admin/sections'),
        api.get('/terms')
      ]);

      setAssignments(assRes.data);
      const facultyData = facRes.data.faculty || facRes.data.users || (Array.isArray(facRes.data) ? facRes.data : []);
      setFaculty(facultyData);
      setSubjects(subRes.data);
      setSections(secRes.data);
      setTerms(termRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setFeedback({ type: 'error', message: 'Failed to load assignments.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await api.post('/admin/offerings/assign-faculty', {
        faculty_id: Number(formData.facultyId),
        subject_id: Number(formData.subjectId),
        section_id: Number(formData.sectionId),
        term_id: Number(formData.termId)
      });
      
      setFeedback({ type: 'success', message: 'Assigned successfully!' });
      setFormData({ facultyId: '', sectionId: '', subjectId: '', termId: '' });
      setIsFormModalOpen(false);
      
      const res = await api.get('/admin/offerings');
      setAssignments(res.data);
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Assignment failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAssignment = async (id, payload) => {
    try {
      await api.put(`/admin/offerings/${id}`, payload);
      const res = await api.get('/admin/offerings');
      const newAssignments = res.data;
      setAssignments(newAssignments);
      
      if (selectedFacultyGroup) {
         const updatedGroup = Object.values(groupLogic(newAssignments)).find(g => g.faculty?.id === selectedFacultyGroup.faculty?.id);
         if (updatedGroup) setSelectedFacultyGroup(updatedGroup);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteAssignment = async () => {
     if (!assignmentToDelete) return;
     setIsDeleting(true);
     try {
       await api.delete(`/admin/offerings/${assignmentToDelete.id}`);
       const newAssignments = assignments.filter(a => a.id !== assignmentToDelete.id);
       setAssignments(newAssignments);
       
       if (selectedFacultyGroup) {
          const updatedGroup = Object.values(groupLogic(newAssignments)).find(g => g.faculty?.id === selectedFacultyGroup.faculty?.id);
          if (updatedGroup) setSelectedFacultyGroup(updatedGroup);
          else {
              setIsDrawerOpen(false);
              setSelectedFacultyGroup(null);
          }
       }
       setAssignmentToDelete(null);
     } catch (err) {
       console.error('Delete error:', err);
     } finally {
       setIsDeleting(false);
     }
  };

  const groupLogic = (data) => {
    const groups = {};
    data.forEach(ass => {
      const fid = ass.faculty_id;
      if (!groups[fid]) {
        groups[fid] = {
          faculty: ass.faculty,
          faculty_name: ass.faculty_name,
          items: []
        };
      }
      groups[fid].items.push(ass);
    });
    return groups;
  };

  const groupedAssignments = useMemo(() => {
    const groups = groupLogic(assignments);
    return Object.values(groups).filter(g => 
      g.faculty_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assignments, searchQuery]);

  const openDetails = (group) => {
    setSelectedFacultyGroup(group);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Faculty Assignments</h1>
            <p className="text-slate-500 font-medium">Assign subjects to faculty members and manage their workload.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsFormModalOpen(true)}
               className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ff6129] hover:bg-[#ff5110] text-white text-sm font-black transition-all shadow-xl shadow-orange-500/25 active:scale-95"
             >
                <Plus size={18} />
                Assign Faculty
             </button>
          </div>
        </div>

        {/* Assignments Records */}
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Assignments</h2>
                 <span className="px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{groupedAssignments.length} Faculty</span>
              </div>
              <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-xs font-bold transition-all"
                />
              </div>
           </div>

           <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Load</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Department</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {loading ? (
                          <tr>
                             <td colSpan="4" className="py-32">
                                <div className="flex flex-col items-center gap-4">
                                   <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
                                </div>
                             </td>
                          </tr>
                       ) : groupedAssignments.length > 0 ? (
                          groupedAssignments.map((group) => (
                             <tr key={group.faculty?.id || Math.random()} className="group hover:bg-slate-50/50 transition-all duration-300 cursor-pointer" onClick={() => openDetails(group)}>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:shadow-lg transition-all duration-300">
                                         {group.faculty?.avatar ? (
                                            <img src={group.faculty.avatar} alt="" className="w-full h-full object-cover" />
                                         ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg font-black font-display text-slate-400 bg-white uppercase">
                                               {group.faculty_name?.charAt(0)}
                                            </div>
                                         )}
                                      </div>
                                      <div>
                                         <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">{group.faculty_name}</p>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: #{group.faculty?.id || '?'}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black border border-primary/10">
                                      <BookOpen size={12} />
                                      {group.items.length} Subjects
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                   <span className="text-[11px] font-bold text-slate-600">
                                      {group.faculty?.dept_name}
                                   </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <div className="flex items-center justify-end gap-3 transition-all">
                                      <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all active:scale-90">
                                         <Edit3 size={18} />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          ))
                       ) : (
                          <tr>
                             <td colSpan="4" className="py-32 text-center text-slate-400 font-bold italic">No assignments found.</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {/* Side Drawer for Details */}
      {isDrawerOpen && selectedFacultyGroup && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDrawerOpen(false)} />
          <div className="w-full max-w-xl bg-white h-full relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3rem]">
            {/* Drawer Header */}
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[2rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                   {selectedFacultyGroup.faculty?.avatar ? (
                      <img src={selectedFacultyGroup.faculty.avatar} alt="" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-400 bg-white">
                         {selectedFacultyGroup.faculty_name?.charAt(0)}
                      </div>
                   )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedFacultyGroup.faculty_name}</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Assignments</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-12 h-12 rounded-[1.5rem] border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all active:scale-95 shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Assignments List in Drawer */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
               <div className="space-y-4">
                  <div className="space-y-4">
                     {selectedFacultyGroup.items.map((item) => (
                        <div key={item.id} className="group p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
                           <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <BookOpen size={20} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight">{item.subject_name}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Subject</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setAssignmentToEdit(item); }}
                                   className="p-2.5 rounded-xl border border-slate-200 text-slate-300 hover:text-primary hover:bg-white hover:shadow-md transition-all active:scale-90"
                                 >
                                    <Edit3 size={16} />
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setAssignmentToDelete(item); }}
                                   className="p-2.5 rounded-xl border border-slate-200 text-slate-300 hover:text-rose-500 hover:bg-white hover:shadow-md transition-all active:scale-90"
                                  >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-2xl bg-white/50 border border-slate-100/50">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Section</p>
                                 <p className="text-xs font-black text-slate-700">{item.section_name}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/50 border border-slate-100/50">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Term</p>
                                 <p className="text-xs font-black text-slate-700">{item.term_name}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="p-10 border-t border-slate-100">
               <button 
                 onClick={() => navigate('/admin/faculty')}
                 className="w-full py-5 bg-slate-900 hover:bg-slate-800 transition-all rounded-2xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
               >
                  Manage Faculty Profile
                  <ChevronRight size={14} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Faculty Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Assign Subject</h3>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Assign faculty to a section</p>
               </div>
               <button onClick={() => setIsFormModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAssign} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty</label>
                  <select 
                    name="facultyId" required value={formData.facultyId} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choose Faculty...</option>
                    {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    name="subjectId" required value={formData.subjectId} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Subject...</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
                  <select 
                    name="sectionId" required value={formData.sectionId} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Section...</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Term</label>
                  <select 
                    name="termId" required value={formData.termId} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Active Term...</option>
                    {terms.map(t => <option key={t.id} value={t.id}>{t.name} {t.is_active ? '(ACTIVE)' : ''}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-5 rounded-[1.5rem] border border-slate-200 text-[11px] font-black uppercase text-slate-500 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-[2] py-5 rounded-[1.5rem] bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <DeleteConfirmationModal 
        isOpen={!!assignmentToDelete}
        onClose={() => setAssignmentToDelete(null)}
        onConfirm={handleDeleteAssignment}
        loading={isDeleting}
        title="Remove Assignment"
        message={`Are you sure you want to remove ${assignmentToDelete?.faculty_name} from ${assignmentToDelete?.subject_name}?`}
      />

      <EditAssignmentModal 
        isOpen={!!assignmentToEdit}
        onClose={() => setAssignmentToEdit(null)}
        onUpdate={handleUpdateAssignment}
        assignment={assignmentToEdit}
        faculty={faculty}
        subjects={subjects}
        sections={sections}
        terms={terms}
      />
    </div>
  );
};

export default FacultyAssignment;

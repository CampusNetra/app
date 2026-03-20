import React, { useEffect, useState } from 'react';
import { RefreshCw, Plus, Users, Grid2X2, Search, ChevronRight, X, BookOpen, UserCheck, Trash2, Calendar } from 'lucide-react';
import api from '../../api';

const SectionsManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Detail Drawer State
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'academics'
  const [sectionStudents, setSectionStudents] = useState([]);
  const [sectionOfferings, setSectionOfferings] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Faculty Assignment State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allFaculty, setAllFaculty] = useState([]);
  const [assignmentData, setAssignmentData] = useState({ subject_id: '', faculty_id: '', term_id: 'default_term' });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/sections');
      setSections(res.data || []);
    } catch (err) {
      console.error('Error fetching sections:', err);
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionDetails = async (section) => {
    setSelectedSection(section);
    setLoadingDetails(true);
    setActiveTab('students');
    try {
      const [stuRes, offRes] = await Promise.all([
        api.get(`/admin/students`, { params: { section_id: section.id, limit: 100 } }),
        api.get(`/admin/offerings`, { params: { section_id: section.id } })
      ]);
      setSectionStudents(stuRes.data?.students || []);
      setSectionOfferings(offRes.data || []);
    } catch (err) {
      console.error('Error fetching section details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openAssignModal = async () => {
    setIsAssignModalOpen(true);
    try {
      const [subjRes, facRes] = await Promise.all([
        api.get('/admin/subjects'),
        api.get('/admin/faculty')
      ]);
      setAllSubjects(subjRes.data || []);
      setAllFaculty(facRes.data || []);
    } catch (err) {
      console.error('Error loading subjects/faculty:', err);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    setCreating(true);
    try {
      await api.post('/admin/sections', { name: newSectionName.trim() });
      setNewSectionName('');
      setIsAddModalOpen(false);
      fetchSections();
    } catch (err) {
      console.error('Error creating section:', err);
      alert(err.response?.data?.error || 'Failed to create section');
    } finally {
      setCreating(false);
    }
  };

  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    try {
      await api.post('/offerings/assign-faculty', {
        ...assignmentData,
        section_id: selectedSection.id
      });
      setIsAssignModalOpen(false);
      // Refresh offerings
      const offRes = await api.get(`/admin/offerings`, { params: { section_id: selectedSection.id } });
      setSectionOfferings(offRes.data || []);
    } catch (err) {
      console.error('Assignment error:', err);
      alert(err.response?.data?.error || 'Failed to assign faculty');
    }
  };

  const filteredSections = sections.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.dept_name && s.dept_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Sections</h1>
          <p className="text-slate-500 mt-1">Organize students into groups and manage academic resource delivery.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Add Section
          </button>
          <button
            onClick={fetchSections}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm text-slate-600"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
         <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by section name or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-medium"
            />
         </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && sections.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          ))
        ) : filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <div key={section.id} className="group bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 flex items-center gap-6 cursor-pointer" onClick={() => fetchSectionDetails(section)}>
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 font-bold text-2xl border border-slate-100 shadow-sm">
                {section.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors truncate font-display">{section.name}</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">{section.dept_name}</p>
                <div className="flex items-center gap-2 mt-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
                <ChevronRight size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-100">
              <Grid2X2 size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">No sections found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">Create student categories to unlock subject assignments and communication flows.</p>
          </div>
        )}
      </div>

      {/* Section Detail Side Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-[-30px_0_60px_rgba(0,0,0,0.15)] z-[1500] transition-all duration-500 transform ${selectedSection ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedSection && (
          <div className="h-full flex flex-col">
            <div className="px-10 py-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Management Hub</span>
                <h3 className="text-3xl font-bold text-slate-900 font-display">{selectedSection.name}</h3>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{selectedSection.dept_name}</p>
              </div>
              <button 
                onClick={() => setSelectedSection(null)}
                className="w-14 h-14 rounded-[1.25rem] border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-white flex items-center justify-center transition-all bg-white shadow-sm group active:scale-90"
              >
                <X size={28} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-10 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex gap-10">
                {[
                  { id: 'students', label: 'Student Directory', icon: Users },
                  { id: 'academics', label: 'Academic Offerings', icon: BookOpen }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-6 border-b-2 transition-all font-bold text-sm tracking-tight ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/20">
              {activeTab === 'students' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-800 font-display">Enrolled Students</h4>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/10">
                      <Plus size={14} /> Import List
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {loadingDetails ? (
                      [1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-2xl bg-white animate-pulse border border-slate-100" />)
                    ) : sectionStudents.length > 0 ? (
                      sectionStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-primary/30 hover:shadow-xl transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-bold transition-all border border-primary/10">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{student.name}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{student.reg_no}</p>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-lg bg-green-50 text-[10px] font-bold text-green-600 uppercase tracking-wider border border-green-100">
                             Verified
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center border-3 border-dashed border-slate-100 rounded-[2.5rem] bg-white">
                        <Users size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-bold">No students found in this section.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-800 font-display">Faculty Resources</h4>
                    <button 
                      onClick={openAssignModal}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <UserCheck size={14} /> Assign Faculty
                    </button>
                  </div>

                  <div className="space-y-4">
                    {loadingDetails ? (
                      [1, 2].map(i => <div key={i} className="h-32 rounded-[2rem] bg-white animate-pulse border border-slate-100" />)
                    ) : sectionOfferings.length > 0 ? (
                      sectionOfferings.map(offering => (
                        <div key={offering.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
                          <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/5 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                              <BookOpen size={28} />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{offering.subject_name}</h5>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                  <UserCheck size={12} />
                                </div>
                                <span className="text-sm font-bold text-slate-600">{offering.faculty_name || 'Unassigned'}</span>
                              </div>
                              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                                 <div className="flex items-center gap-1.5">
                                    <Calendar size={12} className="text-slate-400" />
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{offering.term_id}</span>
                                 </div>
                                 <button className="text-xs font-bold text-primary hover:underline ml-auto">Control Center</button>
                                 <button className="text-xs font-bold text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center border-3 border-dashed border-slate-100 rounded-[2.5rem] bg-white">
                        <BookOpen size={48} className="mx-auto text-slate-100 mb-4" />
                        <p className="text-slate-400 font-bold font-sans">No subject offerings configured.</p>
                        <p className="text-xs font-bold text-slate-300 mt-2 uppercase tracking-widest">Connect subjects to faculty here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Faculty Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
             <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-bold text-slate-900 font-display">Assign Academic Resource</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Connect Subject to Licensed Faculty</p>
                </div>
                <button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center active:scale-90 shadow-sm"
                >
                  <X size={24} />
                </button>
             </div>
             
             <form onSubmit={handleAssignFaculty} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Academic Subject</label>
                      <div className="relative group">
                         <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                         <select 
                           required
                           className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-bold appearance-none transition-all"
                           value={assignmentData.subject_id}
                           onChange={(e) => setAssignmentData({...assignmentData, subject_id: e.target.value})}
                         >
                            <option value="">Choose Subject</option>
                            {allSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                         </select>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Assigned Faculty</label>
                      <div className="relative group">
                         <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                         <select 
                           required
                           className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-bold appearance-none transition-all"
                           value={assignmentData.faculty_id}
                           onChange={(e) => setAssignmentData({...assignmentData, faculty_id: e.target.value})}
                         >
                            <option value="">Choose Faculty</option>
                            {allFaculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                         </select>
                      </div>
                   </div>
                </div>
                
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Academic Term ID</label>
                    <div className="relative group">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                         <input 
                           type="text"
                           required
                           placeholder="e.g. 2024_ODD"
                           className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-bold transition-all"
                           value={assignmentData.term_id}
                           onChange={(e) => setAssignmentData({...assignmentData, term_id: e.target.value})}
                         />
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                   <button
                     type="button"
                     onClick={() => setIsAssignModalOpen(false)}
                     className="flex-1 py-5 rounded-[1.5rem] border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all font-sans"
                   >
                     Discard Request
                   </button>
                   <button
                     type="submit"
                     className="flex-[2] py-5 rounded-[1.5rem] bg-primary text-white text-base font-bold shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-0 transition-all active:scale-[0.98]"
                   >
                     Confirm Assignment
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Add Section Modal remains same but with better styling */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div>
                 <h3 className="text-2xl font-bold text-slate-900 font-display">New Section</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 opacity-60">Cohort Creation</p>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSection} className="p-10 space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Section Identifier</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-base font-medium transition-all shadow-inner"
                  placeholder="e.g. Section 1, Batch A"
                />
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" disabled={creating || !newSectionName.trim()} className="w-full py-4 rounded-2xl bg-primary text-white text-base font-bold shadow-xl shadow-primary/30 hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50">
                  {creating ? 'Finalizing...' : 'Initialize Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsManagement;

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Layers, 
  Calendar, 
  PlusCircle, 
  Search, 
  Filter, 
  SortDesc, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import api from '../../api';

const FacultyAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

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
      // Faculty is wrapped in an object with pagination
      const facultyData = facRes.data.faculty || facRes.data.users || (Array.isArray(facRes.data) ? facRes.data : []);
      setFaculty(facultyData);
      setSubjects(subRes.data);
      setSections(secRes.data);
      setTerms(termRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setFeedback({ type: 'error', message: 'Failed to synchronize with academic database.' });
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
      
      setFeedback({ type: 'success', message: 'Faculty assignment updated successfully!' });
      setFormData({ facultyId: '', sectionId: '', subjectId: '', termId: '' });
      
      // Refresh list
      const res = await api.get('/admin/offerings');
      setAssignments(res.data);
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Assignment update failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Faculty Assignments</h1>
            <p className="text-slate-500 font-medium">Coordinate academic resources and streamline department coordination.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Sync Active</span>
             </div>
          </div>
        </div>

        {/* New Assignment Panel */}
        <section className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <PlusCircle size={22} />
              </div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Allocate Academic Resource</h2>
            </div>
          </div>

          <form className="p-10 space-y-10" onSubmit={handleAssign}>
            {feedback && (
              <div className={`p-5 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                feedback.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <Trash2 size={18} />}
                <p className="text-sm font-black uppercase tracking-wider">{feedback.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Users size={14} className="text-primary" /> Faculty
                </label>
                <select 
                  name="facultyId"
                  required
                  value={formData.facultyId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose Faculty...</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.dept_name || 'Faculty'})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-500" /> Subject
                </label>
                <select 
                  name="subjectId"
                  required
                  value={formData.subjectId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Subject...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={14} className="text-orange-500" /> Section
                </label>
                <select 
                  name="sectionId"
                  required
                  value={formData.sectionId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Section...</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className="text-rose-500" /> Term
                </label>
                <select 
                  name="termId"
                  required
                  value={formData.termId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Active Term...</option>
                  {terms.map(t => (
                    <option key={t.id} value={t.id}>{t.name} {t.is_active ? '(ACTIVE)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button 
                type="submit"
                disabled={submitting}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {submitting ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                Confirm Assignment
              </button>
            </div>
          </form>
        </section>

        {/* Assignments Records */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Deployments</h2>
                 <span className="px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{assignments.length} Records</span>
              </div>
           </div>

           <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty Resource</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assignment Details</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Academic Period</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {loading ? (
                          <tr>
                             <td colSpan="4" className="py-32">
                                <div className="flex flex-col items-center gap-4">
                                   <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Records...</p>
                                </div>
                             </td>
                          </tr>
                       ) : assignments.length > 0 ? (
                          assignments.map((ass) => (
                             <tr key={ass.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:shadow-lg transition-all duration-300">
                                         {ass.faculty?.avatar ? (
                                            <img src={ass.faculty.avatar} alt="" className="w-full h-full object-cover" />
                                         ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg font-black font-display text-slate-400 bg-white uppercase">
                                               {ass.faculty?.name?.charAt(0)}
                                            </div>
                                         )}
                                      </div>
                                      <div>
                                         <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">{ass.faculty?.name}</p>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Resource ID: ACAD-00{ass.id}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-2">
                                         <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">
                                            {ass.subject_name || ass.subject}
                                         </span>
                                         <ArrowRight size={12} className="text-slate-300" />
                                         <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-100/50">
                                            {ass.section_name || ass.section}
                                         </span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div>
                                      <p className="text-sm font-bold text-slate-700">{ass.term_name || ass.term || 'FALL-202X'}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">Assigned at {new Date(ass.created_at).toLocaleDateString()}</p>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                      <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all active:scale-90">
                                         <Edit3 size={18} />
                                      </button>
                                      <button className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90">
                                         <Trash2 size={18} />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          ))
                       ) : (
                          <tr>
                             <td colSpan="4" className="py-32 text-center text-slate-400 font-bold italic">No faculty assignments synchronized.</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAssignment;

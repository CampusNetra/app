import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    facultyId: '',
    branch: '',
    section: '',
    subject: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/faculty-assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      // Fallback data
      setAssignments([
        {
          id: 1,
          faculty: {
            name: 'Dr. Emily Stone',
            title: 'Senior Lecturer',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE3MCtcPY9rZuFLHAUQjusGfsGiE9UBxpoUrlOnkMyyLxspqa9cKh4UBhb1TLHU5MGiHqM697OxsU9Aty6dh-QZ4IMVeLhVbRUWr_SJgtzuyS6st9-EiZYUGZ4TV7RMjCRaguB6F05PMPlBnzx_eTXOEqgJSXKDf5Sdtvlc7F6PDNBr28spgSc4Z5cz_OdFJ2pPu0Oj2p17y-S5Uk9PYBrBNPWg6TlRuCv9CSype5gb_jexWotk_sJS0_ydDFnMViRKDP3L56aQ1k'
          },
          subject: 'Data Structures',
          section: 'CS-A101 (Section A)',
          assignedDate: '2023-10-12T00:00:00Z'
        },
        {
          id: 2,
          faculty: {
            name: 'Prof. Alan Turing',
            title: 'HOD, CS Dept',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1oeIWgFkKCJ9TsTKXYLskiezTxYlyaBQ7UCQLhgctPvk48vGCfdufyt7L_qeh-s4AxFM4syWyvc20FWukaz2MyXVFkIi38kAtEhzy2_pFh75ACYI2EJ_qzePhabeYFmh_zsOG9SNUfXF6Yn3qgf101XqifvSmKCg1dtb7Xds1faPepGE2kVSLvyry-li5sv6LeRaGdHI8FazRs8DO-3PpTUoXTjkoD2x81mKlOsHR-VW2JabgPi4FDbRP7iw-tD4RcYrCkSSe9PA'
          },
          subject: 'Cryptography',
          section: 'CS-B205 (Section B)',
          assignedDate: '2023-11-05T00:00:00Z'
        },
        {
          id: 3,
          faculty: {
            name: 'Dr. Sarah Connor',
            title: 'Asst. Professor',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsbP6pefpCi3eNbZSBbhxP3qGDSFTTmZaUx-hIht9hPyqRjyX3lxoyLLqbzhJxMPHgn7tUAaNB6Swt032KPUaVxeT2ZpAeTlimXYLqqQIK5XjBRbBDi2Hxink6hBAhQcYQJpeWERu_F2EiCwHgK3wLnWqy1C73tu6NRYciTN_NDkRN88MvS4me0lUBRid3b6Nh8Fpt7KiPRWXH0pl6IAC0Lt3aHkkDf1taYxEiJlPsaorgdxn-DXu3rlgIsuHAdinfopjSyPIOTk'
          },
          subject: 'Cyber Security',
          section: 'CS-C301 (Section C)',
          assignedDate: '2024-01-18T00:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    console.log('Assigning specific faculty:', formData);
    // Submit action goes here
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-background-light text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Faculty Assignment</h1>
            <p className="text-slate-500 mt-1">Configure and manage academic resource distribution across departments.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
              Export Report
            </button>
          </div>
        </div>

        {/* New Assignment Form Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            <h2 className="text-lg font-bold">New Assignment</h2>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end" onSubmit={handleAssign}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Faculty</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <select 
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
                >
                  <option value="">Search faculty name...</option>
                  <option value="1">Dr. Emily Stone</option>
                  <option value="2">Prof. Alan Turing</option>
                  <option value="3">Dr. Sarah Connor</option>
                  <option value="4">Prof. James Maxwell</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Branch</label>
              <select 
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
              >
                <option value="">Select Branch</option>
                <option value="cs">Computer Science</option>
                <option value="ee">Electrical Engineering</option>
                <option value="me">Mechanical Engineering</option>
                <option value="ar">Architecture</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Section</label>
              <select 
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
              >
                <option value="">Select Section</option>
                <option value="A-1">A-1</option>
                <option value="B-2">B-2</option>
                <option value="C-3">C-3</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Subject</label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
              >
                <option value="">Select Subject</option>
                <option value="ds">Data Structures</option>
                <option value="alg">Algorithms</option>
                <option value="db">Database Systems</option>
              </select>
            </div>
            
            <div className="lg:col-span-4 flex justify-end">
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
                Assign Faculty
              </button>
            </div>
          </form>
        </section>

        {/* Current Assignments Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">list_alt</span>
              <h2 className="text-lg font-bold">Current Assignments</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors bg-white/50 border border-slate-200">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors bg-white/50 border border-slate-200">
                <span className="material-symbols-outlined">sort</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Faculty</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Section</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : assignments.length > 0 ? (
                    assignments.map((assignment, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                              {assignment.faculty.avatar ? (
                                <img src={assignment.faculty.avatar} alt={assignment.faculty.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                                  {assignment.faculty.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{assignment.faculty.name}</p>
                              <p className="text-xs text-slate-500">{assignment.faculty.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {assignment.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{assignment.section}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">
                            {new Date(assignment.assignedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-500">No assignments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Showing {assignments.length} of {assignments.length} assignments</p>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-white rounded-md border border-slate-200 text-slate-400 disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="px-3 py-1 bg-primary text-white rounded-md text-xs font-bold">1</button>
                <button className="p-1 hover:bg-white rounded-md border border-slate-200 text-slate-400 disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FacultyAssignment;

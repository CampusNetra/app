import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      // Fallback data for preview 
      setStudents([
        {
          id: 1,
          reg_number: 'CS2023-0042',
          name: 'Alex Thompson',
          email: 'alex.t@university.edu',
          branch: 'Comp. Science',
          year: '2nd Year',
          section: 'A',
          status: 'Active',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_7ZjuQbzA_rWJ7VIZ-q9VQI8EmJkaUfiXkIPtjTZ9RfjWMn50Ijk6MLqUlrxaGWdlKQCxwNy4LuwuCOfEsJVCyKTQklOOeDQo3z_TJrdlNeQWI68yA-v0xLBkfmZeSOS4K7Kd17D8jNV6fn3bpbqbAmv0KlBEX_Kr4cXQiyYKAlNwNco7FkAfUcHaHoB-vaGmL9yRRrT6nVXY5g1RlPoL36JYNsm94OKaKwE8SWX7UQ-0FwfVtq6ttaxGfM6wfgSJHjbgqzSc78'
        },
        {
          id: 2,
          reg_number: 'EE2022-0118',
          name: 'Elena Rodriguez',
          email: 'elena.r@university.edu',
          branch: 'Electronics',
          year: '3rd Year',
          section: 'C',
          status: 'On Leave',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG_ikw4NZIUUZMGc6kKxKkJrdhb0tGJz2qKTZyBcTMTNycsj87PZtnfwp1yAe6wkvUyPr8AYfw4OWeRh2TWn-2SQSoXaXARGyqMsayftlPppgmzeRRhmKa4qdTYzvU2_seOSFSr2nQYi6v3ypkg9HdOoZPAil97ldNZfiJwIQE0KykmCQlnOK58MHONkLf1FyTkSb0jQLoU_suHvOtlGmI2wdsxcIY9iMdZ3W3_cXQzByfmaZjvAjlf1mKTh7bBiZLIIrVop-Yqv8'
        },
        {
          id: 3,
          reg_number: 'ME2024-0012',
          name: 'Jordan Smith',
          email: 'jsmith@university.edu',
          branch: 'Mechanical',
          year: '1st Year',
          section: 'B',
          status: 'Active',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7q9E3R3jKh9ehS7sPcO2sE4xZuy1PUeQF5CUJqT9xd2ogoPdmX3RUD2tAriUPCFFIvzb9J0xlKbOnMmOWqH0a-vAEGwElIU3I7wksl6SYvVLZKoTdey5hF6rMkKU0i9n5lG1J63li6E_xddwk9xT-8mOVPzEe4mpyHqPdx5cvssO2jJ08NXPkXtaUYM91HJh_7NUCSJV0hdrwCkXdGqZurwTPLY1CmZWE36R6_Xw4f8q151sMNrJaTnfmrXmmfWE34za5lUITM-g'
        },
        {
          id: 4,
          reg_number: 'CS2021-0205',
          name: 'Siddharth V.',
          email: 'sid.v@university.edu',
          branch: 'Comp. Science',
          year: '4th Year',
          section: 'A',
          status: 'Disabled',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3tmf6xA2cMpd3dIU_iO2EWWkugasfRohUggm1sW4ODn57jMaz42f_9Rw9XCSgYloGbrtVB67OZ4uUfgIZAtIoY1DdkvDvRp725uIavHJd07mb5TgKMBzCArDPmRH016_iYUOWBHamLU_ZntyfXec7FzJJJaTXLw5n5uxd_e-N-gYpJgUUDYMB3f_M_xLRe3wKcCsD5Hq_bK_3Sb10zUgrzDIcmOjPwX5PTN0s1fT0r6Y9DcZ4LpirWO0L0ZRV8FnK4xTNdzBYiM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">Active</span>;
      case 'on leave':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">On Leave</span>;
      case 'disabled':
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">Disabled</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light">
      {/* Page Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-slate-500 mt-1">Manage and monitor student records across all departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">file_download</span>
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Student
          </button>
        </div>
      </div>

      {/* Table Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none">
          <option value="">All Branches</option>
          <option value="cs">Computer Science</option>
          <option value="ee">Electronics</option>
          <option value="me">Mechanical</option>
          <option value="ce">Civil</option>
        </select>
        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none">
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
          <span className="material-symbols-outlined text-sm">filter_alt</span>
          More Filters
        </button>
      </div>

      {/* High-Density Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reg Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{student.reg_number}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                          {student.avatar ? (
                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                              {student.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                    <td className="px-6 py-4 text-sm">{student.branch}</td>
                    <td className="px-6 py-4 text-sm">{student.year}</td>
                    <td className="px-6 py-4 text-sm font-medium">{student.section}</td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors group relative inline-flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/30">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{students.length}</span> of <span className="font-medium text-slate-900">{students.length}</span> students
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg">1</button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;

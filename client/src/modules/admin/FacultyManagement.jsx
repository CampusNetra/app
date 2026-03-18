import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/faculty', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(res.data);
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setFaculty([
        {
          id: 1,
          faculty_id: '#FAC-2931',
          name: 'Dr. Robert Fischer',
          email: 'robert.f@campus.edu',
          department: 'Computer Science',
          subjects: ['AI/ML', 'Data Science'],
          status: 'Active',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc-cd3nwtlUU4jfBDpi1bU-KE7VaReanImzkzjQYyJAnP4xRljnw_uXZYF0xbxe3USMCvnB-dCKhW9pyzHVPKE2hmcP8c4RnHzCGmu3z4w55TDd_LZhnbltWrJv1xPNdVNO7WhWEe2Af55Qo6ZCxtEktziYanoOE-dgjzumoj49zdWzFRfyTcDdpbNXsp1ocWS2H-lCA0q8I8ceb0fhafL1OPeKJsCg1lutjzHPbRiUTcI2vyL4Kh9Zr3nMwxoLEWRHmDDFvaAcBQ',
          phone: '+1 (555) 123-4567',
          office: 'Science Block B, Room 204'
        },
        {
          id: 2,
          faculty_id: '#FAC-2940',
          name: 'Dr. Elena Rodriguez',
          email: 'elena.rod@campus.edu',
          department: 'Mathematics',
          subjects: ['Calculus', 'Linear Algebra'],
          status: 'Active',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaqqsYZg2iiJgNtvQWGpk2d06Oyt4mVDwoZS1I9Ln030J4zBX43rHxMEkiBOCkWTqyrigTvk-SDVx2i5CDut5kDmYGoocQXf8PA8jST2Xhtn6YuReLBVtRLHmNi1dX-qChEp24OMgUHzBEvV3eBSCXO_BeWrXHt0dB7zMJnFSIypJd6gwWO33_Dmb58nPZHX9_Cjn3-bpYvye28vnFzAley4hkvmqVFrIupV-3mJdkOPIBMnreV7Rb32HazECGWJu2eyKM8rxf68',
          phone: '+1 (555) 234-8910',
          office: 'Science Block A, Room 402'
        },
        {
          id: 3,
          faculty_id: '#FAC-3012',
          name: 'Prof. James Sterling',
          email: 'j.sterling@campus.edu',
          department: 'Physics',
          subjects: ['Quantum Mech'],
          status: 'On Leave',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMXaKhSB30RniOecA0lEo7uUPPNp8OWUh3RQ6H0cgGNJQY87Swoxlq3IKBI93KZWRD16jnpvJtDYuWQTwXmqoXrbx1OseViz7zMzPxAcX36yNldvvF2nqBTNxz42ZAM8jukJCk8EKUEZwIWh5peAX9TIgiIV_CDKWHNQ9UV2MD7xCliApFR2krmdVdVnvJpBvUG9-bettuYPO9VcL_xDOQf30ThkuwZmvM1z0gp692SenD8kmo7m5z3O3bducl8VwVJ8l5YlCYmn8',
          phone: '+1 (555) 345-6789',
          office: 'Engineering Wing, Room 105'
        },
        {
          id: 4,
          faculty_id: '#FAC-3105',
          name: 'Dr. Linda Chen',
          email: 'linda.chen@campus.edu',
          department: 'Computer Science',
          subjects: ['Cybersecurity'],
          status: 'Active',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA54EwkgrkpKyAxv56eaKY-BEXqX-1szVd4hTIhBqz5QW7RgV9c2PrFi2ML6Cz3WdIpHkFc_XUuO9HXwMK4ksWyQmsvAggf7CgSHxDT5xg8mSgKFq_ahwY5Bwh42pS318GImpZ-kxpw7GN34jw3Z_XcXLvXoVAsc8TryMVJqWpxM2akHGZn0j-bRcvJ14ySSIrYfgIbernSCxlIhm8OaGTmaD2eK4s82_cWwOsUPGVSUuCP1nC8mO1QS0WGUW98hvSEn8P95rwywPI',
          phone: '+1 (555) 456-7890',
          office: 'Cyber Lab, Room 301'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
          </span>
        );
      case 'on leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> On Leave
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex relative bg-background-light">
      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Faculty</h2>
              <p className="text-slate-500 text-sm mt-1">Manage, filter, and monitor all university staff members.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-slate-200 bg-white text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">file_download</span> Import CSV
              </button>
              <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined text-lg">add</span> Add Faculty
              </button>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Filter by name or ID..." 
                className="w-full bg-transparent border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-primary transition-all outline-none"
              />
            </div>
            <select className="bg-transparent border-slate-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:border-primary transition-all outline-none w-full md:w-auto">
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Humanities</option>
            </select>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hidden md:block">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Faculty ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Subjects</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : faculty.length > 0 ? (
                    faculty.map((member, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedFaculty(member)}
                        className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-slate-500">{member.faculty_id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                  {member.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{member.name}</p>
                              <p className="text-[11px] text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{member.department}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {member.subjects?.map((sub, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(member.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1 hover:bg-slate-200 rounded transition-colors group relative inline-flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <span className="material-symbols-outlined text-slate-400">more_horiz</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-500">No faculty found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">Showing 1 to {faculty.length} of {faculty.length} results</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs border border-slate-200 rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 text-xs border border-slate-200 rounded-md bg-white shadow-sm font-bold text-slate-900">1</button>
                <button className="px-3 py-1 text-xs border border-slate-200 rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Details Side Panel (Drawer) */}
      <div 
        className={`absolute inset-y-0 right-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ${
          selectedFaculty ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedFaculty && (
          <>
            {/* Panel Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 overflow-hidden ring-4 ring-orange-50">
                  {selectedFaculty.avatar ? (
                    <img src={selectedFaculty.avatar} alt={selectedFaculty.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-500">
                      {selectedFaculty.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedFaculty.name}</h3>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">{selectedFaculty.department}</p>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                onClick={() => setSelectedFaculty(null)}
              >
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Status & Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> {selectedFaculty.status}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Emp. Type</p>
                  <p className="text-sm font-bold text-slate-900">Full Time</p>
                </div>
              </div>

              {/* Contact Details */}
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact & Location</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                    <div>
                      <p className="text-xs text-slate-500">Email Address</p>
                      <p className="text-sm font-medium text-slate-900">{selectedFaculty.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="text-sm font-medium text-slate-900">{selectedFaculty.phone || '+1 (555) 000-0000'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                    <div>
                      <p className="text-xs text-slate-500">Office Location</p>
                      <p className="text-sm font-medium text-slate-900">{selectedFaculty.office || 'TBD'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Academic Assignments */}
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Assignments</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Current Subjects</p>
                    <div className="space-y-2">
                      {selectedFaculty.subjects?.map((sub, i) => (
                        <div key={i} className="p-3 bg-white border border-slate-100 rounded-lg flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                              <span className="material-symbols-outlined text-sm text-slate-500">book</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900">{sub}</p>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{sub.substring(0,4)}-101</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Panel Actions */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Edit Details
              </button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                Message
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay to close drawer when clicking outside (visible only on mobile) */}
      {selectedFaculty && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden"
          onClick={() => setSelectedFaculty(null)}
        />
      )}
    </div>
  );
};

export default FacultyManagement;

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  Search,
  User,
  X,
  Grid2X2,
  Upload,
} from 'lucide-react';
import api from '../../api';
import UserModal from './components/UserModal';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyToEdit, setFacultyToEdit] = useState(null);

  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchFaculty();
  }, [search, activeStatus, page]);

  useEffect(() => {
    if (!selectedFaculty) return;

    const freshSelection = faculty.find((member) => member.id === selectedFaculty.id);
    if (freshSelection) {
      setSelectedFaculty(freshSelection);
    } else {
      setSelectedFaculty(null);
    }
  }, [faculty, selectedFaculty]);

  const fetchFaculty = async () => {
    setLoading(true);
    setError('');

    const params = {
      page,
      limit,
      search: search || undefined,
      is_active:
        activeStatus === '' ? undefined : activeStatus === 'active' ? 1 : 0,
    };

    try {
      const res = await api.get('/admin/faculty', { params });
      setFaculty(res.data?.faculty || []);
      setTotal(Number(res.data?.pagination?.total || 0));
      setTotalPages(Number(res.data?.pagination?.totalPages || 1));
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setError(err.response?.data?.error || 'Failed to load faculty');
      setFaculty([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setActiveStatus('');
    setPage(1);
  };

  const openAddModal = () => {
    setFacultyToEdit(null);
    setCreateError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = () => {
    setFacultyToEdit(selectedFaculty);
    setCreateError('');
    setIsEditModalOpen(true);
  };

  const handleCreateFaculty = async (payload) => {
    setCreatingUser(true);
    setCreateError('');
    try {
      await api.post('/admin/faculty', payload);
      setIsAddModalOpen(false);
      await fetchFaculty();
    } catch (err) {
      console.error('Error creating faculty:', err);
      setCreateError(err.response?.data?.error || 'Failed to create faculty');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleUpdateFaculty = async (payload) => {
    setCreatingUser(true);
    setCreateError('');
    try {
      await api.put(`/admin/faculty/${facultyToEdit.id}`, payload);
      setIsEditModalOpen(false);
      await fetchFaculty();
      if (selectedFaculty?.id === facultyToEdit.id) {
         setSelectedFaculty(prev => ({ ...prev, ...payload }));
      }
    } catch (err) {
      console.error('Error updating faculty:', err);
      setCreateError(err.response?.data?.error || 'Failed to update faculty');
    } finally {
      setCreatingUser(false);
    }
  };

  const rangeLabel = useMemo(() => {
    if (total === 0) return '0 to 0';
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `${start} to ${end}`;
  }, [page, total]);

  const getFacultyCode = (member) => {
    if (member.reg_no) return member.reg_no;
    if (member.enrollment_no) return member.enrollment_no;
    return `FAC-${String(member.id).padStart(4, '0')}`;
  };

  const getInitials = (name) => {
    if (!name) return 'FA';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (isActive) => {
    if (Number(isActive) === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Disabled
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty</h1>
          <p className="text-slate-500 mt-1">Directory from department records with active status and subject assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
            onClick={() => console.log('Import faculty clicked')}
          >
            <Upload size={18} />
            Import
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Add Faculty
          </button>
          <button
            type="button"
            onClick={fetchFaculty}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <select
          value={activeStatus}
          onChange={(e) => {
            setPage(1);
            setActiveStatus(e.target.value);
          }}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">All Access</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {error ? (
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Access</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                  </td>
                </tr>
              ) : faculty.length > 0 ? (
                faculty.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-700">{getFacultyCode(member)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-900 block">{member.name}</span>
                          <span className="text-xs text-slate-500">{member.email || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{member.dept_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {member.subjects?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {member.subjects.slice(0, 2).map((subject, idx) => (
                            <span key={`${member.id}-${idx}`} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                              {subject}
                            </span>
                          ))}
                          {member.subjects.length > 2 ? (
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                              +{member.subjects.length - 2}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{getStatusBadge(member.is_active)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(member.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedFaculty(member)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">No faculty found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/30">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{rangeLabel}</span> of{' '}
            <span className="font-medium text-slate-900">{total}</span> faculty members
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg">{page}</span>
            <button
              type="button"
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Detail Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-[620px] max-w-[92vw] h-[100vh] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[1500] transform transition-transform duration-500 ease-out ${
          selectedFaculty ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedFaculty ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-start justify-between relative bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden">
                   {getInitials(selectedFaculty.name)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight font-display tracking-tight">
                    {selectedFaculty.name}
                  </h3>
                  <p className="text-[11px] font-black text-primary/80 uppercase tracking-[0.2em] mt-1">
                    {selectedFaculty.dept_name || 'General'} DEPT.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFaculty(null)}
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-white flex items-center justify-center transition-all group shadow-sm"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Status & Type Chips */}
              <div className="flex gap-3">
                <div className="flex-1 p-4 rounded-2xl bg-green-50/50 border border-green-100/50 flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-md">
                   <p className="text-[10px] font-black text-green-700/40 uppercase tracking-widest">Status</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-black text-green-700">{Number(selectedFaculty.is_active) === 1 ? 'Active' : 'Offline'}</span>
                   </div>
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-md">
                   <p className="text-[10px] font-black text-blue-700/40 uppercase tracking-widest">Emp. Type</p>
                   <span className="text-sm font-black text-blue-700">{selectedFaculty.employment_type || 'Full Time'}</span>
                </div>
              </div>

              {/* Contact & Location */}
              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Location</h4>
                <div className="space-y-5">
                   <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                         <User size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                         <p className="text-sm font-bold text-slate-700 break-all">{selectedFaculty.email || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-all">
                         <RefreshCw className="rotate-90" size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                         <p className="text-sm font-bold text-slate-700">{selectedFaculty.phone || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                         <Grid2X2 size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office Location</p>
                         <p className="text-sm font-bold text-slate-700 font-display">{selectedFaculty.office_location || 'N/A'}</p>
                      </div>
                   </div>
                </div>
              </section>

              {/* Assignments */}
              <section className="space-y-6 pt-4">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignments</h4>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 mb-3 ml-1 uppercase">Assigned Sections</p>
                       <div className="flex flex-wrap gap-2">
                          {selectedFaculty.assignedSections?.length ? selectedFaculty.assignedSections.map(sec => (
                            <span key={sec} className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider border border-orange-100/50 hover:bg-orange-100 transition-colors cursor-default">
                              {sec}
                            </span>
                          )) : (
                            <p className="text-xs text-slate-400 ml-1 font-medium italic">No sections assigned</p>
                          )}
                       </div>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 mb-3 ml-1 uppercase">Current Subjects</p>
                       <div className="space-y-3">
                          {selectedFaculty.subjects?.length ? selectedFaculty.subjects.map((sub, i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-lg transition-all group">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                      {sub.charAt(0)}
                                   </div>
                                   <p className="text-sm font-bold text-slate-900 font-display">{sub}</p>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{sub.slice(0, 3)}-{400 + i}</span>
                             </div>
                          )) : (
                            <p className="text-xs text-slate-400 ml-1 font-medium italic">No active subject assignments found</p>
                          )}
                       </div>
                    </div>
                 </div>
              </section>

              {/* Recent Activity */}
              <section className="space-y-5 pt-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h4>
                <div className="space-y-6 ml-2 border-l-2 border-slate-100 pl-6 pb-4">
                   {selectedFaculty.recentActivity?.map((act, i) => (
                      <div key={i} className="relative group">
                         <div className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ring-white ${act.c} transition-transform group-hover:scale-125`} />
                         <p className="text-sm font-bold text-slate-800 leading-tight">{act.t}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{act.d}</p>
                      </div>
                   ))}
                </div>
              </section>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={openEditModal}
                className="py-4 rounded-2xl border border-slate-200 text-sm font-black text-slate-900 hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                Edit Details
              </button>
              <button
                type="button"
                className="py-4 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-950/10 flex items-center justify-center underline underline-offset-4"
              >
                Message
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {selectedFaculty ? (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1400] transition-opacity duration-500" onClick={() => setSelectedFaculty(null)} />
      ) : null}

      <UserModal
        isOpen={isAddModalOpen || isEditModalOpen}
        role="faculty"
        loading={creatingUser}
        error={createError}
        user={facultyToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        onSubmit={facultyToEdit ? handleUpdateFaculty : handleCreateFaculty}
      />
    </div>
  );
};

export default FacultyManagement;

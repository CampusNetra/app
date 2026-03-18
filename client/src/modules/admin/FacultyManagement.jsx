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
} from 'lucide-react';
import api from '../../api';
import AddUserModal from './components/AddUserModal';

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
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

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
    setCreateError('');
    setIsAddModalOpen(true);
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
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e53935] hover:bg-[#d32f2f] text-white text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Add Faculty
          </button>
          <button
            type="button"
            onClick={fetchFaculty}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={16} />
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

      <div
        className={`fixed inset-y-0 right-0 w-[390px] max-w-[92vw] bg-white border-l border-slate-200 shadow-2xl z-[1200] transform transition-transform duration-300 ${
          selectedFaculty ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedFaculty ? (
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(selectedFaculty.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">{selectedFaculty.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{selectedFaculty.email || '-'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFaculty(null)}
                className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Faculty ID</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{getFacultyCode(selectedFaculty)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Role</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{selectedFaculty.role || 'faculty'}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3">Details</p>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Department:</span> {selectedFaculty.dept_name || '-'}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Verification:</span> {selectedFaculty.verification_status || '-'}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Access:</span> {Number(selectedFaculty.is_active) === 1 ? 'Active' : 'Disabled'}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Joined:</span> {formatDate(selectedFaculty.created_at)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3">Assigned Subjects</p>
                {selectedFaculty.subjects?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.subjects.map((subject, idx) => (
                      <span key={`${selectedFaculty.id}-sub-${idx}`} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                        {subject}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <User size={14} />
                    No subjects assigned
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {selectedFaculty ? (
        <div className="fixed inset-0 bg-slate-900/20 z-[1100]" onClick={() => setSelectedFaculty(null)} />
      ) : null}

      <AddUserModal
        isOpen={isAddModalOpen}
        role="faculty"
        loading={creatingUser}
        error={createError}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateFaculty}
      />
    </div>
  );
};

export default FacultyManagement;

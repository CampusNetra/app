import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '../../api';
import AddUserModal from './components/AddUserModal';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState('');

  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchStudents();
  }, [search, sectionId, verificationStatus, activeStatus, page]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    const params = {
      page,
      limit,
      search: search || undefined,
      section_id: sectionId || undefined,
      verification_status: verificationStatus || undefined,
      is_active:
        activeStatus === '' ? undefined : activeStatus === 'active' ? 1 : 0,
    };

    try {
      const res = await api.get('/admin/students', { params });
      setStudents(res.data?.students || []);
      setSections(res.data?.filters?.sections || []);
      setTotal(Number(res.data?.pagination?.total || 0));
      setTotalPages(Number(res.data?.pagination?.totalPages || 1));
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.error || 'Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearch('');
    setSectionId('');
    setVerificationStatus('');
    setActiveStatus('');
    setPage(1);
  };

  const openAddModal = () => {
    setCreateError('');
    setIsAddModalOpen(true);
  };

  const handleCreateStudent = async (payload) => {
    setCreatingUser(true);
    setCreateError('');
    try {
      await api.post('/admin/students', payload);
      setIsAddModalOpen(false);
      await fetchStudents();
    } catch (err) {
      console.error('Error creating student:', err);
      setCreateError(err.response?.data?.error || 'Failed to create student');
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

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const renderVerificationBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
          Verified
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
        Pending
      </span>
    );
  };

  const renderAccessBadge = (isActive) => {
    if (Number(isActive) === 1) {
      return (
        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
          Active
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
        Disabled
      </span>
    );
  };

  const getPrimaryRegNumber = (student) => {
    return student.reg_no || student.enrollment_no || '-';
  };

  const getSecondaryRegNumber = (student) => {
    if (student.reg_no && student.enrollment_no) {
      return `Enroll: ${student.enrollment_no}`;
    }

    return '';
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background-light">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-slate-500 mt-1">Directory from department records with section and verification visibility.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e53935] hover:bg-[#d32f2f] text-white text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Add Student
          </button>
          <button
            type="button"
            onClick={fetchStudents}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, reg no..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <select
          value={sectionId}
          onChange={(e) => {
            setPage(1);
            setSectionId(e.target.value);
          }}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">All Sections</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </select>
        <select
          value={verificationStatus}
          onChange={(e) => {
            setPage(1);
            setVerificationStatus(e.target.value);
          }}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">All Verification</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
        <div className="flex gap-2">
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
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>
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
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reg Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Access</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Joined</th>
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
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-slate-700">{getPrimaryRegNumber(student)}</p>
                      {getSecondaryRegNumber(student) ? (
                        <p className="text-xs text-slate-400 mt-0.5">{getSecondaryRegNumber(student)}</p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                          {getInitials(student.name)}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{student.dept_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{student.section_name || '-'}</td>
                    <td className="px-6 py-4 text-sm">{renderVerificationBadge(student.verification_status)}</td>
                    <td className="px-6 py-4 text-sm">{renderAccessBadge(student.is_active)}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-500">{formatDate(student.created_at)}</td>
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

        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/30">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{rangeLabel}</span> of{' '}
            <span className="font-medium text-slate-900">{total}</span> students
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
            <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg">
              {page}
            </span>
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

      <AddUserModal
        isOpen={isAddModalOpen}
        role="student"
        sections={sections}
        loading={creatingUser}
        error={createError}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateStudent}
      />
    </div>
  );
};

export default StudentsManagement;

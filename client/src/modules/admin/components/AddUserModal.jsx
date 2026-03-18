import React, { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';

const getInitialFormData = () => ({
  name: '',
  email: '',
  password: '',
  reg_no: '',
  enrollment_no: '',
  verification_status: 'pending',
  is_active: '1',
  section_id: '',
});

const AddUserModal = ({
  isOpen,
  role,
  sections = [],
  loading,
  error,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const roleLabel = role === 'student' ? 'Student' : 'Faculty';

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      reg_no: formData.reg_no.trim() || undefined,
      enrollment_no: formData.enrollment_no.trim() || undefined,
      verification_status: formData.verification_status,
      is_active: Number(formData.is_active),
      section_id:
        role === 'student' && formData.section_id
          ? Number(formData.section_id)
          : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[1300] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#e53935]" />
            <h3 className="text-base font-bold text-slate-900">Add {roleLabel}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center"
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error ? (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="name@domain.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Registration No</label>
              <input
                type="text"
                value={formData.reg_no}
                onChange={(e) => handleChange('reg_no', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Enrollment No</label>
              <input
                type="text"
                value={formData.enrollment_no}
                onChange={(e) => handleChange('enrollment_no', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Optional"
              />
            </div>

            {role === 'student' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
                <select
                  value={formData.section_id}
                  onChange={(e) => handleChange('section_id', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Unassigned</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>{section.name}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Verification</label>
              <select
                value={formData.verification_status}
                onChange={(e) => handleChange('verification_status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Access</label>
              <select
                value={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="1">Active</option>
                <option value="0">Disabled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#e53935] text-white text-sm font-semibold hover:bg-[#d32f2f] disabled:opacity-60"
            >
              {loading ? 'Saving...' : `Create ${roleLabel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

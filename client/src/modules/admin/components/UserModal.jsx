import React, { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';

const getInitialFormData = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  office_location: user?.office_location || '',
  employment_type: user?.employment_type || 'Full Time',
  avatar_url: user?.avatar_url || '',
  reg_no: user?.reg_no || '',
  enrollment_no: user?.enrollment_no || '',
  section_id: user?.section_id || '',
  is_active: user?.is_active ?? 1,
  verification_status: user?.verification_status || 'pending',
});

const UserModal = ({
  isOpen,
  role,
  sections = [],
  loading,
  error,
  onClose,
  onSubmit,
  user,
}) => {
  const [formData, setFormData] = useState(getInitialFormData(user));

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(user));
    }
  }, [isOpen, role, user]);

  if (!isOpen) return null;

  const isEdit = !!user;
  const roleLabel = role === 'student' ? 'Student' : 'Faculty';

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      password: isEdit ? undefined : (formData.reg_no.trim() || formData.enrollment_no.trim() || '123456'), 
      reg_no: formData.reg_no.trim() || undefined,
      enrollment_no: formData.enrollment_no.trim() || undefined,
      verification_status: formData.verification_status,
      is_active: Number(formData.is_active),
      section_id:
        role === 'student' && formData.section_id
          ? Number(formData.section_id)
          : undefined,
    };

    if (role === 'faculty') {
      payload.phone = formData.phone.trim() || undefined;
      payload.office_location = formData.office_location.trim() || undefined;
      payload.employment_type = formData.employment_type;
      payload.avatar_url = formData.avatar_url.trim() || undefined;
    }

    await onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-[1300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-6xl bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all transform scale-100 animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus size={22} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {isEdit ? 'Edit' : 'Add New'} {roleLabel}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {isEdit ? 'Update existing' : 'Create a new'} {roleLabel.toLowerCase()} profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center justify-center"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {error ? (
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-sm font-semibold text-rose-600 animate-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                placeholder="Enter full legal name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                placeholder="name@university.edu"
              />
            </div>

            {role === 'faculty' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="+91 XXXXX-XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Office Location</label>
                  <input
                    type="text"
                    value={formData.office_location}
                    onChange={(e) => handleChange('office_location', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="e.g. Block A, Room 402"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Emp. Type</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => handleChange('employment_type', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Visiting">Visiting</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Registration No</label>
              <input
                type="text"
                value={formData.reg_no}
                required={!formData.enrollment_no}
                onChange={(e) => handleChange('reg_no', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                placeholder="REG-202X-XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Enrollment No</label>
              <input
                type="text"
                value={formData.enrollment_no}
                required={!formData.reg_no}
                onChange={(e) => handleChange('enrollment_no', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                placeholder="ENR-202X-XXX"
              />
            </div>

            {role === 'student' ? (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Section Assignment</label>
                <select
                  value={formData.section_id}
                  onChange={(e) => handleChange('section_id', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose a section...</option>
                  <option value="0">Unassigned / General</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>{section.name}</option>
                  ))}
                </select>
              </div>
            ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Avatar URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => handleChange('avatar_url', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="https://..."
                  />
                </div>
            )}

            {isEdit && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Status</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Verification</label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) => handleChange('verification_status', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-base text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                isEdit ? 'Apply Changes' : `Add ${roleLabel}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

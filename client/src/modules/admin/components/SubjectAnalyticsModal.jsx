import React from 'react';
import { BarChart3, BookOpen, Loader2, MessageSquare, Sparkles, Users, X } from 'lucide-react';

const chipClassName =
  'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500';

const SubjectAnalyticsModal = ({
  isOpen,
  onClose,
  loading,
  creatingChannels,
  analytics,
  error,
  onCreateChannels
}) => {
  if (!isOpen) return null;

  const offerings = analytics?.offerings || [];
  const summary = analytics?.summary || {};
  const assignedFaculty = analytics?.assignedFaculty || [];
  const assignedSections = analytics?.assignedSections || [];

  return (
    <div className="fixed inset-0 z-[2200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 bg-slate-50/50 px-8 py-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-[#ff6129]">
              <BarChart3 size={26} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                {analytics?.subject?.name || 'Subject Analytics'}
              </h3>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Review assigned faculty, assigned sections, and subject channel coverage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-96px)] overflow-y-auto px-8 py-8">
          {loading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
              <Loader2 size={34} className="animate-spin text-[#ff6129]" />
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                Loading Analytics
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 px-6 py-5 text-sm font-black text-rose-600">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-[2rem] border border-slate-100 bg-slate-50/80 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Offerings</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{summary.totalOfferings || 0}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-100 bg-slate-50/80 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{summary.assignedFacultyCount || 0}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-100 bg-slate-50/80 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sections</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{summary.assignedSectionCount || 0}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-100 bg-slate-50/80 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Missing Channels</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{summary.missingChannelCount || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-100 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Users size={18} className="text-[#ff6129]" />
                    <h4 className="text-lg font-black tracking-tight text-slate-900">Assigned Faculty</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignedFaculty.length > 0 ? assignedFaculty.map((faculty) => (
                      <span key={faculty.id} className={chipClassName}>
                        {faculty.name}
                      </span>
                    )) : (
                      <p className="text-sm font-bold text-slate-400">No faculty assigned yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <BookOpen size={18} className="text-[#ff6129]" />
                    <h4 className="text-lg font-black tracking-tight text-slate-900">Assigned Sections</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignedSections.length > 0 ? assignedSections.map((section) => (
                      <span key={section.id} className={chipClassName}>
                        {section.name}
                      </span>
                    )) : (
                      <p className="text-sm font-bold text-slate-400">No sections assigned yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 p-6">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-black tracking-tight text-slate-900">Offering Details</h4>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      Each offering can own one subject channel.
                    </p>
                  </div>
                  <button
                    onClick={onCreateChannels}
                    disabled={creatingChannels}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6129] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-[#ff5110] disabled:opacity-50"
                  >
                    {creatingChannels ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Create Missing Channels
                  </button>
                </div>

                <div className="space-y-3">
                  {offerings.length > 0 ? offerings.map((offering) => (
                    <div
                      key={offering.id}
                      className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-100 bg-slate-50/70 px-5 py-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900">
                          {offering.section_name}
                          {offering.term_name ? ` • ${offering.term_name}` : ''}
                        </p>
                        <p className="text-sm font-bold text-slate-500">
                          Faculty: {offering.faculty_name || 'Unassigned'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={chipClassName}>
                          <MessageSquare size={12} />
                          {offering.channel_name || 'No channel'}
                        </span>
                        <span className={chipClassName}>
                          Members {offering.member_count || 0}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm font-bold text-slate-400">No offerings found for this subject.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectAnalyticsModal;

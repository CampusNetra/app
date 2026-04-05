import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Info,
  FileText,
  UploadCloud,
  X,
  Plus,
  Type,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../student/student.css";

const FacultyUploadMaterial = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState(["Lecture", "Reference"]);
  const [customTag, setCustomTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    description: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/faculty/targets");
      // Map offerings to a unique set of subjects
      const uniqueSubjects = Array.from(
        new Set(res.data.offerings.map((o) => o.subject_id))
      ).map((id) => {
        const offering = res.data.offerings.find((o) => o.subject_id === id);
        return { id: offering.subject_id, name: offering.subject_name };
      });
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const addTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tag) => {
     setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="st-shell bg-slate-50">
      <div className="st-mobile-frame bg-white">
        <header className="st-topbar px-6 border-b border-slate-50 sticky top-0 bg-white z-[90]">
          <button className="st-icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Upload Study Material</h1>
          <button className="st-icon-btn">
            <MoreVertical size={24} className="text-slate-800" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar pb-32">
          <div className="space-y-6">
            {/* Section 1: Material Details */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm shadow-slate-100/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                     <Info size={18} />
                  </div>
                  <h3 className="font-black text-slate-800 tracking-tight">Material Details</h3>
               </div>

               <div className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Material Title</label>
                     <input 
                        placeholder="e.g. Introduction to Thermodynamics"
                        className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Subject Selection</label>
                     <div className="relative">
                        <select 
                           className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none appearance-none"
                        >
                           <option value="">Select a subject</option>
                           {subjects.map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                           ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                           <Plus size={18} className="text-slate-400 rotate-45" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Section 2: File Upload */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm shadow-slate-100/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                     <FileText size={18} />
                  </div>
                  <h3 className="font-black text-slate-800 tracking-tight">File Upload</h3>
               </div>

               <div className="border-2 border-dashed border-slate-100 rounded-[32px] py-12 px-6 text-center bg-slate-50/30 mb-6">
                  <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                     <UploadCloud size={32} />
                  </div>
                  <h4 className="font-black text-slate-800 mb-1">Click to upload or drag and drop</h4>
                  <p className="text-[12px] font-bold text-slate-400">PDF, PPT, DOC, or Video (Max 50MB)</p>
               </div>

               <div className="flex flex-wrap gap-2">
                  {['PDF', 'PPT', 'DOC', 'Video'].map(type => (
                     <div key={type} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-slate-600 cursor-pointer hover:bg-white hover:border-orange-200 transition-all">
                        <FileText size={16} />
                        <span className="text-[12px] font-black uppercase tracking-widest">{type}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Section 3: Additional Info */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm shadow-slate-100/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                     <FileText size={18} />
                  </div>
                  <h3 className="font-black text-slate-800 tracking-tight">Additional Info</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Description</label>
                     <textarea 
                        rows={4}
                        placeholder="Describe what this material covers..."
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:bg-white focus:border-orange-500 transition-all outline-none resize-none leading-relaxed"
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[13px] font-black text-slate-500 uppercase tracking-widest pl-1">Tags (Optional)</label>
                     <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                           <div key={tag} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2">
                              <span className="text-[12px] font-black">{tag}</span>
                              <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                           </div>
                        ))}
                        <button 
                           onClick={() => setShowTagInput(true)}
                           className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 text-slate-400 font-bold text-[12px] hover:bg-white transition-all"
                        >
                           <Plus size={16} />
                           <span>Add Tag</span>
                        </button>
                     </div>

                     {showTagInput && (
                        <div className="flex gap-2">
                           <input 
                              autoFocus
                              value={customTag}
                              onChange={e => setCustomTag(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && addTag()}
                              placeholder="Add custom tags..."
                              className="flex-1 h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 outline-none"
                           />
                        </div>
                     )}
                  </div>

                  <div className="bg-orange-50/50 border border-orange-100 rounded-[28px] p-5 flex items-start gap-4">
                     <div className="w-10 h-10 bg-orange-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white">
                        <Info size={20} className="stroke-[3]" />
                     </div>
                     <div className="flex flex-col">
                        <h4 className="font-black text-orange-800 text-sm leading-none mb-1">Heads up!</h4>
                        <p className="text-[11px] font-bold text-orange-600 leading-normal">Make sure all materials comply with university copyright policies and guidelines.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>

        <footer className="p-6 bg-white border-t border-slate-50 sticky bottom-0 z-[90] flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
           <button className="flex-1 h-16 rounded-[24px] border-2 border-slate-50 font-black text-slate-800 uppercase tracking-widest transition-all active:scale-[0.98]">
              Save Draft
           </button>
           <button className="flex-[1.5] bg-orange-600 text-white h-16 rounded-[24px] flex items-center justify-center gap-2 shadow-xl shadow-orange-100 font-black uppercase tracking-widest active:scale-[0.98] transition-all">
              <UploadCloud size={20} className="stroke-[3]" />
              <span>Upload Material</span>
           </button>
        </footer>
      </div>
    </div>
  );
};

export default FacultyUploadMaterial;

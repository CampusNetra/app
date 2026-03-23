import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileCheck,
  Database
} from 'lucide-react';

const DataImport = () => {
  const studentInputRef = useRef(null);
  const facultyInputRef = useRef(null);

  const [studentUpload, setStudentUpload] = useState({
    loading: false,
    file: null,
    status: 'idle',
    result: null,
    progress: 0
  });

  const [facultyUpload, setFacultyUpload] = useState({
    loading: false,
    file: null,
    status: 'idle',
    result: null,
    progress: 0
  });

  const [showAllErrors, setShowAllErrors] = useState({ student: false, faculty: false });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const setState = type === 'student' ? setStudentUpload : setFacultyUpload;
    setState({
      loading: false,
      file,
      status: 'selected',
      result: null,
      progress: 0
    });
  };

  const handleUpload = async (type) => {
    const state = type === 'student' ? studentUpload : facultyUpload;
    const setState = type === 'student' ? setStudentUpload : setFacultyUpload;
    const endpoint = type === 'student' ? '/api/admin/import-students' : '/api/admin/import-faculty';

    if (!state.file) return;

    setState(prev => ({ ...prev, loading: true, status: 'uploading' }));

    const formData = new FormData();
    formData.append('file', state.file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setState(prev => ({ ...prev, progress: percentCompleted }));
        }
      });

      setState(prev => ({
        ...prev,
        loading: false,
        status: 'completed',
        result: response.data,
        progress: 100
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        status: 'error',
        result: { error: error.response?.data?.error || 'Upload failed' },
        progress: 0
      }));
    }
  };

  const downloadTemplate = (type) => {
    let headers, dummyRows;
    
    if (type === 'student') {
      headers = 'name,reg_no,enrollment_no,section';
      dummyRows = '\nJohn Doe,2024001,EN001,MCA-1\nJane Smith,2024002,EN002,1';
    } else {
      headers = 'name,email,reg_no';
      dummyRows = '\nDr. Watson,watson@univ.edu,FAC001\nProf. Moriarty,moriarty@univ.edu,FAC002';
    }

    const content = headers + dummyRows;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}_template.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100/50 text-green-600 border-green-100',
      uploading: 'bg-primary/10 text-primary border-primary/20 animate-pulse',
      error: 'bg-red-100/50 text-red-600 border-red-100',
      selected: 'bg-amber-100/50 text-amber-600 border-amber-100',
      idle: 'bg-slate-100/50 text-slate-400 border-slate-100'
    };

    return (
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${styles[status]}`}>
        {status === 'idle' ? 'Ready' : status === 'selected' ? 'Ready to Upload' : status}
      </span>
    );
  };

  const renderUploadCard = (type) => {
    const state = type === 'student' ? studentUpload : facultyUpload;
    const inputRef = type === 'student' ? studentInputRef : facultyInputRef;
    const title = type === 'student' ? 'Upload Students' : 'Upload Faculty';
    const subtitle = type === 'student' 
      ? 'Import students and assign to sections.' 
      : 'Import faculty and staff records.';

    return (
      <div className="space-y-6 flex flex-col h-full">
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                <Database size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">{title}</h2>
                <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
              </div>
            </div>
            {renderStatusBadge(state.status)}
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <input
              type="file"
              ref={inputRef}
              onChange={(e) => handleFileChange(e, type)}
              className="hidden"
              accept=".csv"
            />
            <div
              onClick={() => inputRef.current.click()}
              className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer flex-1 ${
                state.status === 'selected' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50/10 hover:border-primary/40 hover:bg-white'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300 ${
                state.status === 'selected' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-200 shadow-sm border border-slate-50'
              }`}>
                {state.status === 'completed' ? <CheckCircle2 size={32} /> : state.status === 'error' ? <AlertCircle size={32} /> : <Upload size={32} />}
              </div>
              
              <div className="text-center px-4">
                <p className="text-lg font-bold text-slate-700 font-display">
                  {state.file ? state.file.name : `Drag & Drop ${type} CSV`}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {state.file ? `${(state.file.size / 1024).toFixed(1)} KB` : 'or click to browse file'}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (state.status === 'selected') handleUpload(type);
                    else inputRef.current.click();
                  }}
                  disabled={state.loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  {state.loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {state.status === 'selected' ? 'Confirm' : 'Select'}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadTemplate(type);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all bg-white shadow-sm text-slate-500"
                >
                  <Download size={16} />
                  Template
                </button>
              </div>
            </div>

            {(state.status === 'uploading' || state.status === 'completed') && (
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">{state.file?.name}</span>
                  <span className="text-xs font-black text-primary">{state.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${state.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {state.result && !state.result.error && (
              <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PROCESSED</p>
                  <p className="text-xl font-black text-slate-900 font-display">{state.result.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">SUCCESS</p>
                  <p className="text-xl font-black text-green-600 font-display">{state.result.success}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">ERRORS</p>
                  <p className="text-xl font-black text-red-600 font-display">{state.result.errors?.length || 0}</p>
                </div>
              </div>
            )}

            {state.result?.errors?.length > 0 && (
              <div className="mt-4 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                <button
                    onClick={() => setShowAllErrors(prev => ({ ...prev, [type]: !prev[type] }))}
                    className="w-full flex items-center justify-between px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    <span>View Error Logs ({state.result.errors.length})</span>
                    <AlertCircle size={14} className="text-red-400" />
                  </button>
                  {showAllErrors[type] && (
                    <div className="max-h-[150px] overflow-y-auto border-t border-slate-100 bg-white">
                      {state.result.errors.map((err, idx) => (
                        <div key={idx} className="px-5 py-3 border-b border-slate-50 last:border-0 flex items-center gap-3">
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">L{err.row}</span>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{err.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {state.result?.error && (
              <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 flex items-center gap-2">
                <AlertCircle size={16} />
                {state.result.error}
              </div>
            )}
          </div>
        </section>

        {/* Data Guide / Documentation */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-200/50 space-y-4">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 size={16} className="text-primary" />
            <h4 className="text-xs font-black uppercase tracking-widest">CSV Format Guide</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Input Column</p>
              {type === 'student' ? (
                <ul className="text-[11px] font-semibold text-slate-600 space-y-1">
                  <li>name</li>
                  <li>reg_no</li>
                  <li>enrollment_no</li>
                  <li>section (e.g. "MCA-1" or "1")</li>
                </ul>
              ) : (
                <ul className="text-[11px] font-semibold text-slate-600 space-y-1">
                  <li>name</li>
                  <li>email</li>
                  <li>reg_no</li>
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Sample Value</p>
              {type === 'student' ? (
                <ul className="text-[11px] font-medium text-slate-400 space-y-1 italic">
                  <li>John Doe</li>
                  <li>2024001</li>
                  <li>EN001</li>
                  <li>MCA-4</li>
                </ul>
              ) : (
                <ul className="text-[11px] font-medium text-slate-400 space-y-1 italic">
                  <li>Dr. Smith</li>
                  <li>smith@univ.edu</li>
                  <li>FAC001</li>
                </ul>
              )}
            </div>
          </div>
          {type === 'student' && (
            <div className="pt-2 border-t border-slate-200/50">
               <p className="text-[10px] text-slate-400 font-medium">
                <span className="text-primary font-bold">Hint:</span> Section "4" automapped to "MCA-4" if no exact match.
               </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-background-light custom-scrollbar">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Data Import</h1>
        <p className="text-slate-500 mt-1">Bulk upload university records securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {renderUploadCard('student')}
        {renderUploadCard('faculty')}
      </div>
      
      <div className="h-10" />
    </div>
  );
};

export default DataImport;

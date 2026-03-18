import React, { useState } from 'react';

const DataImport = () => {
  // State could be added here for handling file uploads, 
  // currently using static UI based on the design mockup
  const [studentFile, setStudentFile] = useState(null);
  const [facultyFile, setFacultyFile] = useState(null);

  const handleStudentUpload = (e) => {
    e.preventDefault();
    // Logic for student CSV upload goes here
  };

  const handleFacultyUpload = (e) => {
    e.preventDefault();
    // Logic for faculty CSV upload goes here
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-background-light text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Data Import</h1>
          <p className="text-slate-500 mt-1">Bulk upload university records using validated CSV files.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Student CSV Card */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Upload Students CSV</h2>
                <p className="text-sm text-slate-500">Last updated: Today at 09:45 AM</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Completed
              </span>
            </div>
            
            <div className="p-8">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:border-primary/50 transition-all group">
                <span className="material-symbols-outlined text-5xl text-slate-300 group-hover:text-primary transition-colors mb-4">
                  cloud_upload
                </span>
                <p className="text-slate-600 font-medium">Drag and drop your student CSV file here</p>
                <p className="text-slate-400 text-sm mt-1">or click to browse from your computer</p>
                
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={handleStudentUpload}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md"
                  >
                    Upload CSV
                  </button>
                  <button className="flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download Example CSV Template
                  </button>
                </div>
              </div>

              {/* Progress Section (Completed) */}
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">students_fall_2024.csv</span>
                    <span className="text-xs text-slate-500">2.4 MB • Uploaded successfully</span>
                  </div>
                  <span className="text-sm font-bold text-primary">100%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-full"></div>
                </div>
              </div>

              {/* Validation Summary */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Rows Processed</p>
                  <p className="text-2xl font-black text-slate-900">1,248</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-green-600 text-xs font-bold uppercase mb-1">Success</p>
                  <p className="text-2xl font-black text-green-700">1,242</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-red-600 text-xs font-bold uppercase mb-1">Errors Detected</p>
                  <p className="text-2xl font-black text-red-700">6</p>
                </div>
              </div>

              {/* Error Log */}
              <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                  <span className="text-sm font-bold text-slate-700">Error Log</span>
                </div>
                <ul className="divide-y divide-slate-100">
                  <li className="px-4 py-3 flex items-start gap-3">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">Row 45</span>
                    <span className="text-sm text-slate-600">
                      Invalid Email Format: <code className="text-red-500">john.doe@edu</code>
                    </span>
                  </li>
                  <li className="px-4 py-3 flex items-start gap-3">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">Row 112</span>
                    <span className="text-sm text-slate-600">
                      Missing Required Field: <span className="italic">Phone Number</span>
                    </span>
                  </li>
                  <li className="px-4 py-3 flex items-start gap-3">
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">Row 892</span>
                    <span className="text-sm text-slate-600">
                      Duplicate Entry: Student ID <code className="text-red-500">STU-99021</code> already exists.
                    </span>
                  </li>
                </ul>
                <button className="w-full text-center py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors bg-slate-50/50">
                  Show 3 more errors
                </button>
              </div>
            </div>
          </section>

          {/* Faculty CSV Card */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Upload Faculty CSV</h2>
                <p className="text-sm text-slate-500">Supported formats: .csv, .xls, .xlsx</p>
              </div>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Ready
              </span>
            </div>
            
            <div className="p-8">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:border-primary/50 transition-all group">
                <span className="material-symbols-outlined text-5xl text-slate-300 group-hover:text-primary transition-colors mb-4">
                  cloud_upload
                </span>
                <p className="text-slate-600 font-medium">Drag and drop your faculty CSV file here</p>
                <p className="text-slate-400 text-sm mt-1">Maximum file size 50MB</p>
                
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={handleFacultyUpload}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md"
                  >
                    Upload CSV
                  </button>
                  <button className="flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download Example CSV Template
                  </button>
                </div>
              </div>

              {/* Progress Section (Empty/Initial State) */}
              <div className="mt-8 space-y-4 opacity-40">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-400">No file selected</span>
                    <span className="text-xs text-slate-400">-- MB</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400">0%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-200 h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataImport;

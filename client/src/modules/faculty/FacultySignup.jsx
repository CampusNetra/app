import React, { useState } from 'react';
import { Briefcase, ArrowRight, ShieldCheck, Key, ArrowLeft, Terminal, Search, Eye, EyeOff, HelpCircle, Mail, Smartphone } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api';
import '../student/student.css'; // Reusing base styles

const FacultySignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step || 1); // 1: Find Account, 2: OTP (Skip), 3: Set Password
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [registerData, setRegisterData] = useState({
    reg_no: '',
    email: '',
    faculty_id: location.state?.faculty_id || null,
    name: location.state?.name || '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const handleFindAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/faculty-register-check', {
        reg_no: registerData.reg_no,
        email: registerData.email
      });
      
      setRegisterData(prev => ({
        ...prev,
        faculty_id: res.data.faculty_id,
        name: res.data.name
      }));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find your faculty record. Please contact the administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/faculty-set-password', {
        faculty_id: registerData.faculty_id,
        password: registerData.password
      });
      
      setStep(4); // Success state
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to activate account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame entrance-animation">
        <main className="st-welcome-main">
          <header className="st-entrance-nav">
             <button onClick={() => navigate('/faculty/login')} className="st-back-round">
                <ArrowLeft size={20} />
             </button>
             <div className="st-step-indicator text-indigo-600">Step {step > 3 ? 3 : step} of 3</div>
          </header>

          <div className="st-welcome-hero small mb-8">
             <div className="st-hero-chip mini bg-indigo-600">
                {step === 1 ? <Search size={32} /> : step === 2 ? <Mail size={32} /> : <Key size={32} />}
             </div>
             <h1 className="st-hero-title">
               {step === 1 ? 'Find Account' : step === 2 ? 'Verification' : step === 3 ? 'Secure Account' : 'Success!'}
             </h1>
             <p className="st-hero-subtitle">
                {step === 1 && 'Enter your faculty registration and email details.'}
                {step === 2 && `An OTP will be sent to ${registerData.email}. (Skip authorized for MVP)`}
                {step === 3 && `Hello Professor ${registerData.name}, please create your secure password.`}
                {step === 4 && 'Your faculty account is now active.'}
             </p>
          </div>

          {step === 1 && (
            <div className="st-entrance-form-container">
               <form onSubmit={handleFindAccount} className="st-entrance-form">
                  <div className="st-entrance-field">
                     <div className="st-field-icon"><Terminal size={20} /></div>
                     <input 
                       required
                       value={registerData.reg_no}
                       onChange={e => setRegisterData({...registerData, reg_no: e.target.value})}
                       placeholder="Faculty Registration Number" 
                       className="st-entrance-input focus:border-indigo-500"
                     />
                  </div>

                  <div className="st-entrance-field">
                     <div className="st-field-icon"><Mail size={20} /></div>
                     <input 
                       required
                       type="email"
                       value={registerData.email}
                       onChange={e => setRegisterData({...registerData, email: e.target.value})}
                       placeholder="Institutional Email Address" 
                       className="st-entrance-input focus:border-indigo-500"
                     />
                  </div>

                  {error && <p className="text-[10px] font-bold text-rose-500 mb-4 text-center">{error}</p>}

                  <button type="submit" disabled={loading} className="st-entrance-btn bg-indigo-600 shadow-indigo-100">
                     {loading ? 'Verifying...' : (
                       <>
                         <span>Find Record</span>
                         <ArrowRight size={20} />
                       </>
                     )}
                  </button>
               </form>
            </div>
          )}

          {step === 2 && (
            <div className="st-entrance-form-container">
               <div className="st-entrance-form">
                  <p className="text-center text-xs text-slate-400 font-bold mb-6 italic">OTP verification backend is currently in preview mode.</p>
                  
                  <div className="st-entrance-field opacity-50">
                     <div className="st-field-icon"><Smartphone size={20} /></div>
                     <input 
                       disabled
                       placeholder="Enter 6-digit OTP" 
                       className="st-entrance-input"
                     />
                  </div>

                  <div className="space-y-3">
                    <button onClick={() => setStep(3)} className="w-full py-4 bg-indigo-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-100 uppercase tracking-widest flex items-center justify-center gap-2">
                       <span>Proceed To Password</span>
                       <ArrowRight size={18} />
                    </button>
                    <button onClick={() => setStep(3)} className="w-full py-4 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">
                       Skip Verification (MVP Mode)
                    </button>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="st-entrance-form-container">
               <form onSubmit={handleSetPassword} className="st-entrance-form">
                  <div className="st-entrance-field">
                     <div className="st-field-icon"><Key size={20} /></div>
                     <input 
                       required
                       type={showPassword ? "text" : "password"}
                       value={registerData.password}
                       onChange={e => setRegisterData({...registerData, password: e.target.value})}
                       placeholder="Create Password" 
                       className="st-entrance-input pr-12 focus:border-indigo-500"
                     />
                     <button 
                       type="button"
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                       onClick={() => setShowPassword(!showPassword)}
                     >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>

                  <div className="st-entrance-field">
                     <div className="st-field-icon"><ShieldCheck size={20} /></div>
                     <input 
                       required
                       type={showPassword ? "text" : "password"}
                       value={registerData.confirmPassword}
                       onChange={e => setRegisterData({...registerData, confirmPassword: e.target.value})}
                       placeholder="Confirm Password" 
                       className="st-entrance-input pr-12 focus:border-indigo-500"
                     />
                  </div>

                  {error && <p className="text-[10px] font-bold text-rose-500 mb-4 text-center">{error}</p>}

                  <button type="submit" disabled={loading} className="st-entrance-btn bg-indigo-600 shadow-indigo-100">
                     {loading ? 'Activating...' : (
                       <>
                         <span>Activate Account</span>
                         <ArrowRight size={20} />
                       </>
                     )}
                  </button>
               </form>
            </div>
          )}

          {step === 4 && (
            <div className="st-success-block entrance-animation text-center mt-8">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
                  <ShieldCheck size={40} strokeWidth={2.5} />
               </div>
               <h2 className="text-2xl font-black text-slate-800 mb-2">Registration Success!</h2>
               <p className="text-slate-500 font-medium mb-8">Professor {registerData.name}, your account is now ready. Take control of your academic dashboard.</p>
               <button onClick={() => navigate('/faculty/login')} className="st-entrance-btn bg-indigo-600">
                  <span>Go to Login</span>
               </button>
            </div>
          )}

          <p className="st-auth-legal-note text-[10px] text-slate-400 font-bold mb-4 mt-12 text-center px-4">
            Faculty accounts follow institutional security guidelines. Contact IT help-desk for registration issues.
          </p>

          <footer className="st-welcome-footer border-t border-slate-100 pt-6 mt-auto">
             <p className="st-welcome-footer-copy">© {new Date().getFullYear()} Campus Netra</p>
             <p className="st-welcome-footer-builder text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                Developed by <a href="https://syntax-sinners.github.io/web/" target="_blank" rel="noopener noreferrer" className="hover:underline underline text-indigo-600 decoration-2">Syntax Sinners</a>
             </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default FacultySignup;

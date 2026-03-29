import React, { useState } from 'react';
import { GraduationCap, ArrowRight, ShieldCheck, Key, ArrowLeft, Terminal, Search, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api';
import './student.css';

const StudentSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step || 1); // 1: Find Account, 2: Set Password
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [registerData, setRegisterData] = useState({
    reg_no: '',
    enrollment_no: '',
    student_id: location.state?.student_id || null,
    name: location.state?.name || '',
    password: '',
    confirmPassword: ''
  });

  const handleFindAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/student-register-check', {
        reg_no: registerData.reg_no,
        enrollment_no: registerData.enrollment_no
      });
      
      setRegisterData(prev => ({
        ...prev,
        student_id: res.data.student_id,
        name: res.data.name
      }));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find your record. Check your details.');
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
      await api.post('/auth/student-set-password', {
        student_id: registerData.student_id,
        password: registerData.password
      });
      
      setStep(3); // Success state
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame entrance-animation">
        <main className="st-welcome-main">
          <header className="st-entrance-nav">
             <button onClick={() => navigate('/student/welcome')} className="st-back-round">
                <ArrowLeft size={20} />
             </button>
             <div className="st-step-indicator">Step {step} of 2</div>
          </header>

          <div className="st-welcome-hero small">
             <div className="st-hero-chip mini">
                {step === 1 ? <Search size={32} strokeWidth={2.5} /> : <Key size={32} strokeWidth={2.5} />}
             </div>
             <h1 className="st-hero-title">{step === 1 ? 'Find Account' : 'Secure Account'}</h1>
             <p className="st-hero-subtitle">
                {step === 1 ? 'Enter your registration details to activate your account.' : `Welcome, ${registerData.name}. Create your new password.`}
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
                       placeholder="Registration Number" 
                       className="st-entrance-input"
                     />
                  </div>

                  <div className="st-entrance-field">
                     <div className="st-field-icon"><ShieldCheck size={20} /></div>
                     <input 
                       required
                       value={registerData.enrollment_no}
                       onChange={e => setRegisterData({...registerData, enrollment_no: e.target.value})}
                       placeholder="Enrollment Number" 
                       className="st-entrance-input"
                     />
                  </div>

                  {error && <p className="st-form-error text-center mb-4">{error}</p>}

                  <button type="submit" disabled={loading} className="st-entrance-btn">
                     {loading ? 'Searching...' : (
                       <>
                         <span>Verify Record</span>
                         <ArrowRight size={20} />
                       </>
                     )}
                  </button>
               </form>
            </div>
          )}

          {step === 2 && (
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
                       className="st-entrance-input pr-12"
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
                       className="st-entrance-input pr-12"
                     />
                  </div>

                  {error && <p className="st-form-error text-center mb-4">{error}</p>}

                  <button type="submit" disabled={loading} className="st-entrance-btn">
                     {loading ? 'Finalizing...' : (
                       <>
                         <span>Set Password</span>
                         <ArrowRight size={20} />
                       </>
                     )}
                  </button>
               </form>
            </div>
          )}

          {step === 3 && (
            <div className="st-success-block entrance-animation text-center">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
                  <ShieldCheck size={40} strokeWidth={2.5} />
               </div>
               <h2 className="text-2xl font-black text-slate-800 mb-2">Registration Success!</h2>
               <p className="text-slate-500 font-medium mb-8">Your account is now activated. You can login with your new password.</p>
               <button onClick={() => navigate('/student/welcome')} className="st-entrance-btn">
                  <span>Go to Login</span>
               </button>
            </div>
          )}

          <p className="st-auth-legal-note text-[10px] text-slate-400 font-bold mb-4 mt-8 text-center px-4">
            By continuing, you agree to the <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <Link className="st-help-link flex items-center justify-center gap-2 mb-6 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors" to="/support">
            <HelpCircle size={16} /> Need help registeration?
          </Link>

          <footer className="st-welcome-footer border-t border-slate-100 pt-6 mt-auto">
             <p className="st-welcome-footer-copy">© {new Date().getFullYear()} Campus Netra</p>
             <p className="st-welcome-footer-builder text-[10px] uppercase font-black text-primary tracking-widest">
               Designed & Developed by <a href="https://syntax-sinners.github.io/web/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 decoration-2">Syntax Sinners</a>
             </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentSignup;

import React, { useState } from 'react';
import { Briefcase, ArrowRight, UserPlus, Fingerprint, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../student/student.css'; // Reusing student styles for consistency

const FacultyWelcome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('faculty_token')) {
      navigate('/faculty/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/faculty-login', {
        identifier: formData.identifier,
        password: formData.password
      });

      const { token, user } = res.data;
      localStorage.setItem('faculty_token', token);
      localStorage.setItem('faculty_user', JSON.stringify(user));
      
      // Navigate to faculty dashboard (to be created)
      navigate('/faculty/dashboard');
    } catch (err) {
      if (err.response?.data?.error?.includes('activated') || err.response?.data?.error?.includes('password')) {
        setShowRegModal(true);
      } else {
        setError(err.response?.data?.error || 'Login failed. Check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame entrance-animation">
        <main className="st-welcome-main">
          {/* Hero Section */}
          <div className="st-welcome-hero">
             <div className="st-hero-chip bg-indigo-600 shadow-indigo-200">
                <Briefcase size={44} className="text-white" strokeWidth={2.5} />
             </div>
             <h1 className="st-hero-title font-black text-2xl">Campus Netra</h1>
             <p className="st-hero-subtitle text-xs">Faculty portal for academic excellence.</p>
          </div>

          {/* Login Form Section */}
          <div className="st-entrance-form-container">
             <div className="st-entrance-header">
                <h2 className="text-base font-black">Faculty Access</h2>
                <div className="st-badge mini">Staff Edition</div>
             </div>

             <form onSubmit={handleLogin} className="st-entrance-form">
                <div className="st-entrance-field">
                   <div className="st-field-icon"><Fingerprint size={18} /></div>
                   <input 
                     required
                     value={formData.identifier}
                     onChange={e => setFormData({...formData, identifier: e.target.value})}
                     placeholder="Email or Employee ID" 
                     className="st-entrance-input"
                   />
                </div>

                <div className="st-entrance-field">
                   <div className="st-field-icon"><Lock size={18} /></div>
                   <input 
                     required
                     type={showPassword ? "text" : "password"}
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                     placeholder="Your Password" 
                     className="st-entrance-input pr-12"
                   />
                   <button 
                     type="button"
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                     onClick={() => setShowPassword(!showPassword)}
                   >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>

                {error && <p className="text-[10px] font-bold text-rose-500 mb-4 text-center">{error}</p>}

                <button type="submit" disabled={loading} className="st-entrance-btn py-4 text-sm bg-indigo-600 shadow-indigo-100">
                   {loading ? 'Authenticating...' : (
                     <>
                       <span>Sign In</span>
                       <ArrowRight size={18} />
                     </>
                   )}
                </button>
             </form>
          </div>

          {/* Registration Prompt Section */}
          <div className="st-registration-card border-indigo-50 bg-indigo-50/50">
             <div className="st-reg-icon bg-white text-indigo-600"><UserPlus size={28} /></div>
             <div className="st-reg-content">
                <h3 className="text-base font-black text-indigo-900">New Faculty Member?</h3>
                <p className="text-xs text-indigo-700/60 font-medium">Activate your institutional account to manage your classes.</p>
                <button 
                   onClick={() => setShowRegModal(true)} 
                   className="st-reg-link flex items-center gap-2 mt-2 text-indigo-600 font-black text-xs uppercase tracking-wider"
                >
                   <span>Get Started</span>
                   <ArrowRight size={14} />
                </button>
             </div>
          </div>

          <p className="st-auth-legal-note text-[10px] text-slate-400 font-bold mb-6">
            By continuing, you agree to the <Link to="/terms-of-service" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
          </p>

          <Link className="st-help-link flex items-center justify-center gap-2 mb-8 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors" to="/support">
            <HelpCircle size={16} /> Need assistance?
          </Link>

          <footer className="st-welcome-footer border-t border-slate-100 pt-6">
             <p className="st-welcome-footer-copy">© {new Date().getFullYear()} Campus Netra</p>
             <p className="st-welcome-footer-builder">
               Designed & Developed by <a href="https://syntax-sinners.github.io/web/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black hover:underline underline-offset-4 decoration-2">Syntax Sinners</a>
             </p>
          </footer>
        </main>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden p-8 text-center shadow-2xl scale-in duration-300">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <UserPlus size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Activation Required</h3>
              <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">Please complete your registration first by verifying your faculty record and setting a password.</p>
              
              <div className="space-y-3">
                 <button 
                   onClick={() => navigate('/faculty/signup')}
                   className="w-full py-4 bg-indigo-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                 >
                    Start Activation
                 </button>
                 <button 
                   onClick={() => setShowRegModal(false)}
                   className="w-full py-4 text-slate-400 text-sm font-black hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest"
                 >
                    Cancel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FacultyWelcome;

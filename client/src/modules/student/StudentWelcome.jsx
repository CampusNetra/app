import React, { useState } from 'react';
import { GraduationCap, ArrowRight, UserPlus, Fingerprint, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import './student.css';

const StudentWelcome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/student-login', {
        identifier: formData.identifier,
        password: formData.password
      });

      const { token, user } = res.data;
      sessionStorage.setItem('student_token', token);
      sessionStorage.setItem('student_user', JSON.stringify(user));
      
      // Navigate to splash/loading then feed
      navigate('/student/splash');
    } catch (err) {
      if (err.response?.data?.error === 'You need to create your account password first.') {
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
             <div className="st-hero-chip">
                <GraduationCap size={44} className="text-white" strokeWidth={2.5} />
             </div>
             <h1 className="st-hero-title font-black text-2xl">Campus Netra</h1>
             <p className="st-hero-subtitle text-xs">Your gateway to the academic heartbeat.</p>
          </div>

          {/* Login Form Section */}
          <div className="st-entrance-form-container">
             <div className="st-entrance-header">
                <h2 className="text-base font-black">Access Portal</h2>
                <div className="st-badge mini">Student Edition</div>
             </div>

             <form onSubmit={handleLogin} className="st-entrance-form">
                <div className="st-entrance-field">
                   <div className="st-field-icon"><Fingerprint size={18} /></div>
                   <input 
                     required
                     value={formData.identifier}
                     onChange={e => setFormData({...formData, identifier: e.target.value})}
                     placeholder="Name or Registration No" 
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
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                     onClick={() => setShowPassword(!showPassword)}
                   >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>

                {error && <p className="text-[10px] font-bold text-rose-500 mb-4 text-center">{error}</p>}

                <button type="submit" disabled={loading} className="st-entrance-btn py-4 text-sm">
                   {loading ? 'Entering...' : (
                     <>
                       <span>Log In</span>
                       <ArrowRight size={18} />
                     </>
                   )}
                </button>
             </form>
          </div>

          {/* Registration Prompt Section */}
          <div className="st-registration-card">
             <div className="st-reg-icon"><UserPlus size={28} /></div>
             <div className="st-reg-content">
                <h3 className="text-base font-black">New to the Portal?</h3>
                <p className="text-xs text-slate-500 font-medium">Register first before login to access your campus workspace.</p>
                <button 
                   onClick={() => setShowRegModal(true)} 
                   className="st-reg-link flex items-center gap-2 mt-2 text-primary font-black text-xs uppercase tracking-wider"
                >
                   <span>Register Now</span>
                   <ArrowRight size={14} />
                </button>
             </div>
          </div>

          <p className="st-auth-legal-note text-[10px] text-slate-400 font-bold mb-6">
            By continuing, you agree to the <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <Link className="st-help-link flex items-center justify-center gap-2 mb-8 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors" to="/support">
            <HelpCircle size={16} /> Need help logging in?
          </Link>

          <footer className="st-welcome-footer border-t border-slate-100 pt-6">
             <p className="st-welcome-footer-copy">© {new Date().getFullYear()} Campus Netra</p>
             <p className="st-welcome-footer-builder">
               Designed & Developed by <a href="https://syntax-sinners.github.io/web/" target="_blank" rel="noopener noreferrer" className="text-primary font-black hover:underline underline-offset-4 decoration-2">Syntax Sinners</a>
             </p>
          </footer>
        </main>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden p-8 text-center shadow-2xl scale-in duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <UserPlus size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Register Required</h3>
              <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">It looks like this is your first time here. You need to create your password first before you can log in.</p>
              
              <div className="space-y-3">
                 <button 
                   onClick={() => navigate('/student/signup')}
                   className="w-full py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-widest"
                 >
                    Register Now
                 </button>
                 <button 
                   onClick={() => setShowRegModal(false)}
                   className="w-full py-4 text-slate-400 text-sm font-black hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest"
                 >
                    Maybe Later
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentWelcome;

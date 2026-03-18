import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dept_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/auth/signup', formData);
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display">
      <header className="w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <h1 className="text-slate-900 font-bold text-xl tracking-tight">CampusConnect</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Admin Portal</span>
            <Link to="/admin/login" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[480px]">
          <div className="bg-white border border-primary/10 shadow-xl shadow-primary/5 rounded-xl p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create an account</h2>
              <p className="text-slate-500 mt-2">Join the CampusConnect admin platform to manage your department.</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-background-light border border-primary/20 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">University Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@university.edu"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-background-light border border-primary/20 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-background-light border border-primary/20 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Department Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">account_balance</span>
                  <input
                    type="text"
                    name="dept_name"
                    placeholder="e.g. Computer Science"
                    required
                    value={formData.dept_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-background-light border border-primary/20 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
              </div>
              
              <div className="text-center pt-6">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/admin/login" className="text-primary font-bold hover:underline">Log in</Link>
                </p>
              </div>
            </form>

            <p className="text-[11px] text-center text-slate-400 mt-8 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link to="/admin/terms" className="underline hover:text-slate-600">Terms of Service</Link> and{' '}
              <Link to="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center">
        <div className="flex justify-center items-center gap-6 text-slate-400 text-xs">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">shield</span> Secure Authentication</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified_user</span> Verified Universities</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">support_agent</span> 24/7 Admin Support</span>
        </div>
      </footer>
    </div>
  );
};

export default Signup;

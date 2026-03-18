import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import api from "../../api";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin/welcome");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cn-auth-page">
      <header className="cn-auth-topbar">
        <Link to="/" className="cn-auth-brandmark">
          <div className="cn-auth-brandmark-icon">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <span className="cn-auth-brandmark-text">Campus Netra</span>
        </Link>

        <nav className="cn-auth-topnav">
          <Link to="/support">Support</Link>
          <Link to="/resources">Resources</Link>
        </nav>
      </header>

      <main className="cn-auth-main">
        <div className="cn-auth-shell">
          <div className="cn-auth-header">
            <h1 className="cn-auth-heading">Welcome back</h1>
            <p className="cn-auth-subtext">
              Sign in to your administrator dashboard
            </p>
          </div>
    <div className="bg-background-light min-h-screen flex flex-col font-display text-slate-900">
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined !text-[20px]">school</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">CampusConnect</h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Support</Link>
          <Link to="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Documentation</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
              <span className="material-symbols-outlined text-primary !text-[32px]">admin_panel_settings</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm">Enter your administrator credentials to manage your campus</p>
          </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@university.edu"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-700 disabled:opacity-70 h-11 px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                {!loading && <span className="material-symbols-outlined !text-[18px]">login</span>}
              </button>
            </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/admin/signup" className="auth-link">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

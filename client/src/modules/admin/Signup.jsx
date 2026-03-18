import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react';
import api from '../../api';
import './auth.css';

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
      await api.post('/auth/signup', formData);
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
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
      </header>

      <main className="cn-auth-main">
        <div className="cn-auth-shell">
          <div className="cn-auth-header">
            <h1 className="cn-auth-heading">Join the Network</h1>
            <p className="cn-auth-subtext">Register your department with Campus Netra</p>
          </div>

          <div className="cn-auth-card">
            {error && (
              <div className="cn-auth-alert">
                <span>{error}</span>
              </div>
            )}

            <form className="cn-auth-form" onSubmit={handleSubmit}>
              <div className="cn-auth-field">
                <label htmlFor="name">Full Name</label>
                <div className="cn-auth-input-wrap">
                  <User size={18} />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cn-auth-field">
                <label htmlFor="email">Work Email</label>
                <div className="cn-auth-input-wrap">
                  <Mail size={18} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@university.edu"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cn-auth-field">
                <label htmlFor="password">Password</label>
                <div className="cn-auth-input-wrap">
                  <Lock size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    className="cn-auth-toggle"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="cn-auth-field">
                <label htmlFor="dept_name">Department Name</label>
                <div className="cn-auth-input-wrap">
                  <Building2 size={18} />
                  <input
                    id="dept_name"
                    type="text"
                    name="dept_name"
                    placeholder="e.g. Computer Science"
                    required
                    value={formData.dept_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button className="cn-auth-submit" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Create Admin Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
            
            <p className="cn-auth-footer-note">
              Already have an account?{' '}
              <Link to="/admin/login" className="cn-auth-inline-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="cn-auth-bottom">
        <div className="cn-auth-bottom-nav">
          <Link to="/platform">Platform</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/support">Support</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
        
        <div className="cn-auth-bottom-legal">
          <p className="cn-auth-copyright">
            © {new Date().getFullYear()} Campus Netra. Proudly serving Galgotias University.
          </p>
          <a href="https://syntax-sinners.github.io/web/" target="_blank" rel="noreferrer" className="cn-auth-badge">
            Built by <span>Syntax Sinners</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Signup;

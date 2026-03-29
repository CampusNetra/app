import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import './student.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    enrollmentNo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem('student_login');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setIsAutoLogin(true);
      } catch (e) {
        console.log('Could not load saved credentials');
      }
    }
  }, []);

  // Auto-login with saved credentials
  useEffect(() => {
    if (!isAutoLogin || isSubmitting || !formData.regNo || !formData.enrollmentNo) return;
    
    setIsAutoLogin(false);
    performLogin(formData.regNo, formData.enrollmentNo, formData.name);
  }, [isAutoLogin]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const performLogin = async (regNo, enrollmentNo, name) => {
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        reg_no: regNo.trim(),
        enrollment_no: enrollmentNo.trim()
      };

      const response = await api.post('/auth/student-login', payload);
      const { user, token } = response.data || {};

      if (!token) {
        setError('Login failed: No authentication token received');
        setIsSubmitting(false);
        return;
      }

      // Save credentials to localStorage for future logins
      localStorage.setItem('student_login', JSON.stringify({
        name: name.trim(),
        regNo: regNo.trim(),
        enrollmentNo: enrollmentNo.trim()
      }));

      sessionStorage.setItem('student_user', JSON.stringify({
        ...user,
        entered_name: name.trim()
      }));
      sessionStorage.setItem('student_token', token);

      navigate('/student/splash');
    } catch (err) {
      const message = err?.response?.data?.error || 'Unable to verify your details. Please try again.';
      setError(message);
      setIsSubmitting(false);
    }
  };

  const handleContinue = async (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    await performLogin(formData.regNo, formData.enrollmentNo, formData.name);
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame">
        <header className="st-topbar">
          <button className="st-icon-btn" onClick={() => navigate('/student/splash')}>
            <ArrowLeft size={28} />
          </button>
          <h2 className="st-login-title">Student Login</h2>
          <span style={{ width: 36 }} />
        </header>

        <main className="st-auth-main">
          <div className="st-auth-brand">
            <div className="st-auth-logo">
              <GraduationCap size={54} />
            </div>
            <h1>Campus Netra</h1>
            <p>Your details will be verified using your university email.</p>
          </div>

          <form onSubmit={handleContinue}>
            <div className="st-field">
              <label>Full Name</label>
              <input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="st-field">
              <label>Registration Number</label>
              <input
                placeholder="e.g. REG123456"
                value={formData.regNo}
                onChange={(e) => handleChange('regNo', e.target.value)}
                required
              />
            </div>

            <div className="st-field">
              <label>Enrollment Number</label>
              <input
                placeholder="e.g. ENR789012"
                value={formData.enrollmentNo}
                onChange={(e) => handleChange('enrollmentNo', e.target.value)}
                required
              />
            </div>

            {error ? <p className="st-auth-error">{error}</p> : null}

            <button className="st-primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          <p className="st-auth-legal-note">
            By continuing, you agree to the <Link to="/terms-of-service">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>

          <Link className="st-help-link" to="/support">
            <HelpCircle size={20} /> Need help logging in?
          </Link>

          <footer className="st-login-footer">
            <div className="st-login-footer-links">
              <Link to="/">Home</Link>
              <Link to="/support">Support</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
            </div>
            <p className="st-login-footer-copy">© {new Date().getFullYear()} Campus Netra</p>
            <a
              className="st-login-footer-builder"
              href="https://syntax-sinners.github.io/web"
              target="_blank"
              rel="noreferrer"
            >
              Built by Syntax-Sinners for Galgotias University
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentLogin;
import React from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FacultyLogin = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fc', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 460, background: '#fff', border: '1px solid #dce4f1', borderRadius: 18, padding: '1.2rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{ border: '1px solid #dce4f1', background: '#fff', width: 36, height: 36, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff5ef', color: '#e05b1f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} />
          </div>
          <h1 style={{ margin: 0, color: '#0f172a' }}>Faculty Module</h1>
        </div>

        <p style={{ color: '#64748b', lineHeight: 1.6, marginTop: 12 }}>
          Faculty login screen will be connected to OTP and subject assignment flows next. For now, use Admin or Student modules from the landing page.
        </p>

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <Link to="/admin/login" style={{ textDecoration: 'none', borderRadius: 12, padding: '0.7rem 0.9rem', background: '#f45e12', color: '#fff', fontWeight: 700 }}>
            Go To Admin Login
          </Link>
          <Link to="/student/login" style={{ textDecoration: 'none', borderRadius: 12, padding: '0.7rem 0.9rem', border: '1px solid #dce4f1', color: '#0f172a', fontWeight: 700 }}>
            Go To Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#E53935' }}>CampusNetra Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ width: 'auto', padding: '10px 20px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}>Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '30px' }}>
        <aside>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Welcome, {user.name}!</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Department: <strong>{user.dept_id}</strong></p>
          </div>

          <div className="auth-card" style={{ maxWidth: 'none', background: 'white' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Quick Navigation</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <Link to="/admin/terms" style={{ color: '#E53935', fontWeight: '600', textDecoration: 'none' }}>• Term Management</Link>
              </li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', color: '#ccc' }}>• Section Setup (Coming soon)</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', color: '#ccc' }}>• Faculty Directory (Coming soon)</li>
              <li style={{ padding: '10px 0', color: '#ccc' }}>• Student Import (Coming soon)</li>
            </ul>
          </div>
        </aside>

        <main>
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '16px' }}>Get Started</h2>
            <p style={{ color: '#666', marginBottom: '32px' }}>Welcome to the CampusNetra Admin Panel. Use the navigation to manage your academic structure.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/admin/terms" style={{ padding: '12px 24px', background: '#E53935', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                    Configure Academic Terms
                </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

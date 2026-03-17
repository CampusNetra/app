import React from 'react';
import TermManager from './TermManager';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
    return (
        <div style={{ padding: '40px', background: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/admin/dashboard" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: '#666', 
                    textDecoration: 'none',
                    marginBottom: '24px',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ color: '#E53935', fontSize: '28px', marginBottom: '8px' }}>Academic Terms</h1>
                    <p style={{ color: '#666' }}>Define and manage the active semesters for your department.</p>
                </div>

                <TermManager />
            </div>
        </div>
    );
};

export default TermsPage;

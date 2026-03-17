import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TermManager = () => {
    const [terms, setTerms] = useState([]);
    const [newTerm, setNewTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const res = await axios.get('/api/terms');
            setTerms(res.data);
        } catch (err) {
            setError('Failed to fetch terms');
        }
    };

    const handleCreateTerm = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/api/terms', { 
                name: newTerm,
                is_active: terms.length === 0 // Make first term active by default
            });
            setTerms([res.data, ...terms]);
            setNewTerm('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create term');
        } finally {
            setLoading(false);
        }
    };

    const handleActivateTerm = async (id) => {
        try {
            await axios.patch(`/api/terms/${id}/activate`);
            // Update local state instead of full refetch for better UX
            setTerms(terms.map(t => ({
                ...t,
                is_active: t.id === id
            })));
        } catch (err) {
            setError('Failed to activate term');
        }
    };

    return (
        <div style={{ padding: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '20px' }}>Academic Term Management</h3>

            {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleCreateTerm} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="e.g. 2025_ODD"
                    required
                    style={{ flex: 1 }}
                />
                <button type="submit" disabled={loading} style={{ width: 'auto' }}>
                    {loading ? 'Adding...' : 'Add Term'}
                </button>
            </form>

            <div style={{ marginTop: '20px' }}>
                {terms.map(term => (
                    <div key={term.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px', 
                        borderBottom: '1px solid #efefef',
                        background: term.is_active ? '#fff9f0' : 'transparent'
                    }}>
                        <div>
                            <span style={{ fontWeight: '600' }}>{term.name}</span>
                            {term.is_active && (
                                <span style={{ 
                                    marginLeft: '12px', 
                                    fontSize: '11px', 
                                    background: '#FB8C00', 
                                    color: 'white', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px' 
                                }}>ACTIVE</span>
                            )}
                        </div>
                        {!term.is_active && (
                            <button 
                                onClick={() => handleActivateTerm(term.id)}
                                style={{ 
                                    width: 'auto', 
                                    padding: '4px 12px', 
                                    fontSize: '12px',
                                    background: 'transparent',
                                    border: '1px solid #E0E0E0',
                                    color: '#666'
                                }}
                            >
                                Activate
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TermManager;

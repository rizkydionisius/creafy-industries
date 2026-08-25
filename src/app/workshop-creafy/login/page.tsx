"use client";

import React, { useState } from 'react';
import { login } from '@/app/actions/auth';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#D32F2F', fontSize: '2rem', fontWeight: 800 }}>Creafy CMS</h1>
        
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              name="email"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              placeholder="creafy.industries@creafy.id"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              name="password"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#D32F2F', color: 'white', padding: '0.85rem', borderRadius: '8px', border: 'none', 
              fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : 'Login ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('doctor@hospital.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) throw new Error('Invalid login credentials');
      const data = await response.json();
      onLoginSuccess(data.access_token);
    } catch (err: any) {
      setError(err.message || 'Connection to authentication gateway failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1e293b', textAlign: 'center' }}>Clinical Framework Access</h2>
        {error && <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569', fontSize: '14px' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569', fontSize: '14px' }}>Security Key Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
        </div>

        <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
          Authenticate Operator
        </button>
      </form>
    </div>
  );
}
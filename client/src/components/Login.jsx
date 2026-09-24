import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign in to Surplus-to-Shelter</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-semibold">{error}</div>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full min-h-touch px-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <p className="text-xs text-gray-400 mt-1">Hint: admin@surplus.org, donor@bakery.com, driver@volunteer.com, contact@downtownshelter.org</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full min-h-touch px-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-primary text-white min-h-touch rounded font-bold hover:bg-emerald-700 transition disabled:opacity-50 mt-2"
          >
             {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

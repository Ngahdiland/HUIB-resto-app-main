"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [town, setTown] = useState('');
  const [phone, setPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || data.error || 'Login failed');
      } else {
        // Success: redirect
        router.replace('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          region,
          town,
          phone,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || data.error || 'Registration failed');
      } else {
        // Success: redirect
        router.replace('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center bg-white">
      {/* Left: Forms */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 font-semibold rounded-l border border-red-500 ${mode === 'login' ? 'bg-red-600 text-white' : 'bg-white text-red-600'}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-r border border-red-500 border-l-0 ${mode === 'register' ? 'bg-red-600 text-white' : 'bg-white text-red-600'}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
          {error && (
            <div className="mb-4 text-center text-red-600 font-semibold bg-red-50 border border-red-200 rounded p-2">{error}</div>
          )}
          {mode === 'login' ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Login</h1>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input type="email" className="w-full border border-red-300 rounded px-4 py-2" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input type="password" className="w-full border border-red-300 rounded px-4 py-2" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
              <div className="mt-4 text-center">
                <span className="text-gray-700">Don't have an account?</span>{' '}
                <button type="button" className="text-red-600 hover:underline" onClick={() => setMode('register')}>Register</button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <h1 className="text-3xl font-bold text-red-600 mb-4">Register</h1>
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input type="text" className="w-full border border-red-300 rounded px-4 py-2" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Region</label>
                <input type="text" className="w-full border border-red-300 rounded px-4 py-2" value={region} onChange={e => setRegion(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Current Town</label>
                <input type="text" className="w-full border border-red-300 rounded px-4 py-2" value={town} onChange={e => setTown(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Phone Number</label>
                <input type="tel" className="w-full border border-red-300 rounded px-4 py-2" value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input type="email" className="w-full border border-red-300 rounded px-4 py-2" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input type="password" className="w-full border border-red-300 rounded px-4 py-2" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
              <div className="mt-4 text-center">
                <span className="text-gray-700">Already have an account?</span>{' '}
                <button type="button" className="text-red-600 hover:underline" onClick={() => setMode('login')}>Login</button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Right: Welcome Section */}
      <div className="hidden md:flex flex-col justify-center items-center bg-red-50 p-8 w-1/2 h-screen rounded-r">
        <h2 className="text-4xl font-bold text-red-600 mb-4">HuibApp</h2>
        <p className="text-gray-700 text-center">
          Welcome to HuibApp!<br />
          Enjoy fast, fresh, and delicious food delivered to your door. <br />
          - Browse a wide menu<br />
          - Easy, secure checkout<br />
          - Track your orders<br />
          - Get support anytime<br />
          Join us and make your next meal effortless!
        </p>
      </div>
    </div>
  );
}

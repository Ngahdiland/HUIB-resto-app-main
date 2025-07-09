"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import SessionManager from '@/utils/sessionManager';

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.status === 200) {
        if (data.user) {
          // Create a new session for this user
          const sessionManager = SessionManager.getInstance();
          sessionManager.createSession(data.user);
        }
        if (loginEmail.trim().toLowerCase() === 'fonyuydiland@gmail.com') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        alert(data.error || 'Login failed.');
      }
    } catch (err) {
      alert('Server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center bg-white">
      {/* Left: Forms */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Login</h1>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input 
                type="email" 
                className="w-full border border-red-300 rounded px-4 py-2" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-red-300 rounded px-4 py-2 pr-10"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </Button>
            <div className="mt-4 text-center">
              <span className="text-gray-700">Don't have an account?</span>{' '}
              <a href="/register" className="text-red-600 hover:underline">Register</a>
            </div>
          </form>
        </div>
      </div>
      {/* Right: Welcome Section */}
      <div className="hidden md:flex flex-col justify-center items-center bg-red-50 p-8 w-1/2 h-screen rounded-r">
        <h2 className="text-4xl font-bold text-red-600 mb-4">CCF Resto</h2>
        <p className="text-gray-700 text-center">
          Welcome to CCF Resto!<br />
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

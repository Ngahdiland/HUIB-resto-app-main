"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center bg-white">
      {/* Left: Forms */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <form className="space-y-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Login</h1>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input type="email" className="w-full border border-red-300 rounded px-4 py-2" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
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
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit">Login</Button>
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

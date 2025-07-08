"use client";
import React, { useState } from 'react';
import Button from '@/components/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center bg-white">
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <form className="space-y-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Register</h1>
            <div>
              <label className="block mb-1 font-semibold">Name</label>
              <input type="text" className="w-full border border-red-300 rounded px-4 py-2" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input type="email" className="w-full border border-red-300 rounded px-4 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <input type="password" className="w-full border border-red-300 rounded px-4 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit">Register</Button>
            <div className="mt-4 text-center">
              <span className="text-gray-700">Have an account?</span>{' '}
              <a href="/login" className="text-red-600 hover:underline">Login</a>
            </div>
          </form>
        </div>
      </div>
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
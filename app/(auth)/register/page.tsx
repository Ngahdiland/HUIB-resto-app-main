"use client";
import React, { useState } from 'react';
import Button from '@/components/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side validation
    if (!name || !email || !phone || !password || !address || !region) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, address, region }),
      });
      const data = await res.json();
      if (res.status === 201) {
        // Auto-login after successful registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (loginRes.status === 200) {
          if (email.trim().toLowerCase() === 'fonyuydiland@gmail.com') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        } else {
          alert('Registration succeeded but auto-login failed. Please login manually.');
        }
      } else if (res.status === 409) {
        alert('User already exists.');
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (err) {
      alert('Server error.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center bg-white">
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <label className="block mb-1 font-semibold">Phone</label>
              <input type="text" className="w-full border border-red-300 rounded px-4 py-2" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Address</label>
              <input type="text" className="w-full border border-red-300 rounded px-4 py-2" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Region</label>
              <select className="w-full border border-red-300 rounded px-4 py-2" value={region} onChange={e => setRegion(e.target.value)} required>
                <option value="">Select a region</option>
                <option value="Adamawa">Adamawa</option>
                <option value="Centre">Centre</option>
                <option value="East">East</option>
                <option value="Far North">Far North</option>
                <option value="Littoral">Littoral</option>
                <option value="North">North</option>
                <option value="North-West">North-West</option>
                <option value="West">West</option>
                <option value="South">South</option>
                <option value="South-West">South-West</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-red-300 rounded px-4 py-2 pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
            <Button type="submit">Register</Button>
            <div className="mt-4 text-center">
              <span className="text-gray-700">Have an account?</span>{' '}
              <a href="/login" className="text-red-600 hover:underline">Login</a>
            </div>
          </form>
        </div>
      </div>
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
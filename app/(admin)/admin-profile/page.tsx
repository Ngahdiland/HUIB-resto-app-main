'use client';
import React, { useState, useRef, useEffect } from 'react';

const PROFILE_KEY = 'admin_profile';

const defaultProfile = {
  name: 'Admin User',
  email: 'admin@ccfresto.com',
  password: 'admin123',
  photo: '/assets/profile_icon.png',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoPreview, setPhotoPreview] = useState(profile.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      setProfile(JSON.parse(stored));
      setPhotoPreview(JSON.parse(stored).photo);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreview(ev.target?.result as string);
        setProfile((prev) => ({ ...prev, photo: ev.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    const updatedProfile = {
      ...profile,
      password: newPassword ? newPassword : profile.password,
      photo: photoPreview,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setEditMode(false);
    setNewPassword('');
    setConfirmPassword('');
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={photoPreview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
            />
            {editMode && (
              <button
                className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                onClick={() => fileInputRef.current?.click()}
                title="Change Photo"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M4 16v2h2l7.293-7.293-2-2L4 16zm13.707-9.293a1 1 0 0 0-1.414 0l-1.586 1.586 2 2 1.586-1.586a1 1 0 0 0 0-1.414l-1.586-1.586z"/></svg>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <span className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Admin</span>
        </div>
        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editMode}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editMode}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            {editMode ? (
              <>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                  placeholder="New password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Confirm new password"
                />
              </>
            ) : (
              <input
                type="password"
                value={profile.password}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                disabled
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            {editMode ? (
              <>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2"
                  onClick={() => { setEditMode(false); setNewPassword(''); setConfirmPassword(''); setPhotoPreview(profile.photo); }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
        <div className="mt-8 text-xs text-gray-400 text-center">
          <div>Account created: {new Date(profile.createdAt).toLocaleDateString()}</div>
          <div>Last login: {new Date(profile.lastLogin).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

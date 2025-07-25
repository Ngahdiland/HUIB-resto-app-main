"use client";
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import SessionManager from '@/utils/sessionManager';

const AdminHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuItems = [
    { label: 'View Profile', href: '/admin-profile', type: 'link' },
    { label: 'Logout', onClick: () => setShowLogoutModal(true), type: 'button' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!showMenu) return;
    if (e.key === 'ArrowDown') {
      setFocusedIndex((prev) => (prev + 1) % menuItems.length);
    } else if (e.key === 'ArrowUp') {
      setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
    } else if (e.key === 'Enter' && focusedIndex !== -1) {
      const item = menuItems[focusedIndex];
      if (item.type === 'link') {
        window.location.href = item.href!;
      } else if (item.type === 'button' && item.onClick) {
        item.onClick();
      }
      setShowMenu(false);
    } else if (e.key === 'Escape') {
      setShowMenu(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between bg-white border-b border-red-500 px-6 py-3">
      {/* Title */}
      <div className="text-xl font-bold text-red-600">Admin Panel</div>
      {/* Searchbar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 border border-red-300 rounded focus:outline-none focus:border-red-500"
        />
        <button className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Search
        </button>
      </div>
      {/* Profile Button */}
      <div
        className="relative"
        tabIndex={0}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setShowMenu(false);
            setFocusedIndex(-1);
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <button
          className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-100 rounded transition-colors"
          type="button"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={showMenu}
        >
          <FaUserCircle size={24} />
          <span className="hidden md:inline">Profile</span>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-red-200 rounded shadow-lg z-20">
            {menuItems.map((item, idx) =>
              item.type === 'link' ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-2 text-red-600 hover:bg-red-100 focus:bg-red-100 outline-none ${focusedIndex === idx ? 'bg-red-100' : ''}`}
                  tabIndex={-1}
                  onMouseEnter={() => setFocusedIndex(idx)}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.label}
                  className={`w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 focus:bg-red-100 outline-none ${focusedIndex === idx ? 'bg-red-100' : ''}`}
                  tabIndex={-1}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Logout</h2>
              <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    const sessionManager = SessionManager.getInstance();
                    sessionManager.logout();
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;

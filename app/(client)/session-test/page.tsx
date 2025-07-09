"use client";
import React, { useState, useEffect } from 'react';
import SessionManager from '@/utils/sessionManager';

export default function SessionTest() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [sessionManager] = useState(() => SessionManager.getInstance());

  useEffect(() => {
    updateUserInfo();
    const interval = setInterval(updateUserInfo, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const updateUserInfo = () => {
    const user = sessionManager.getCurrentUser();
    const sessions = sessionManager.getAllSessions();
    setCurrentUser(user);
    setAllSessions(sessions);
  };

  const handleLogout = () => {
    sessionManager.logout();
    updateUserInfo();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Multi-User Session Test</h1>
        
        {/* Current User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Session</h2>
          {currentUser ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Phone:</strong> {currentUser.phone}</p>
              <p><strong>Address:</strong> {currentUser.address}</p>
              <p><strong>Region:</strong> {currentUser.region}</p>
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout Current User
              </button>
            </div>
          ) : (
            <div className="text-gray-600">
              <p>No user logged in</p>
              <a href="/login" className="text-red-600 hover:underline">Go to Login</a>
            </div>
          )}
        </div>

        {/* All Active Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">All Active Sessions ({allSessions.length})</h2>
          {allSessions.length > 0 ? (
            <div className="space-y-4">
              {allSessions.map((session, index) => (
                <div key={session.sessionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">Session {index + 1}</h3>
                      <p className="text-sm text-gray-600">ID: {session.sessionId}</p>
                      <p className="text-sm text-gray-600">User: {session.user.name} ({session.user.email})</p>
                      <p className="text-sm text-gray-600">Created: {new Date(session.createdAt).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Last Activity: {new Date(session.lastActivity).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      {session.sessionId === sessionStorage.getItem('huib_current_session') && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Current Tab</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No active sessions</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Test Multi-User Functionality:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Open this page in multiple browser windows/tabs</li>
            <li>Log in with different users in each window</li>
            <li>Each window will maintain its own session independently</li>
            <li>You can see all active sessions listed above</li>
            <li>Cart data is also session-specific</li>
            <li>Logout in one window won't affect other windows</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 
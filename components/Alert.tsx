import React from 'react';

const Alert = ({ message, type = 'error' }: { message: string; type?: 'error' | 'success' }) => (
  <div className={`px-4 py-2 rounded mb-4 ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
    {message}
  </div>
);

export default Alert;

import React from 'react';

const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors disabled:opacity-50"
    {...props}
  >
    {children}
  </button>
);

export default Button;

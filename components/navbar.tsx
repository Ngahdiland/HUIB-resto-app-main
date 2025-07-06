"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
  { href: '/#how-to-order', label: 'How to Order' },
];

const rightLinks = [
    { href: '/cart', label: <FaShoppingCart size={18} /> },
  { href: '/profile', label: 'Profile' },
  { href: '/login', label: 'Login' },
];

const Navbar = () => {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    `relative text-red-600 px-3 py-1 rounded transition-colors duration-200
    hover:bg-red-500 hover:text-white
    ${pathname === href ? 'active-link' : ''}`;

  return (
    <nav className="bg-white border-b border-red-500 px-4 py-2 flex items-center justify-between">
      <div className="text-2xl font-bold text-red-600">HuibApp</div>
      <div className="flex-1 flex justify-center">
        <div className="flex gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              scroll={link.href.startsWith('/#')}
            >
              <span className="relative z-10">{link.label}</span>
              {pathname === link.href && (
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-red-500 rounded transition-all duration-300 animate-active-line" />
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        {rightLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClass(link.href)}
          >
            <span className="relative z-10">{link.label}</span>
            {pathname === link.href && (
              <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-red-500 rounded transition-all duration-300 animate-active-line" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

// Tailwind CSS: Add this to your globals.css or tailwind.config.js
// .active-link { position: relative; }
// .animate-active-line { animation: activeLine 0.3s; }
// @keyframes activeLine { from { width: 0; } to { width: 100%; } }

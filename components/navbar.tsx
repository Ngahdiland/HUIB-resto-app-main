"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

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
  // { href: '/login', label: 'Login' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = (href: string) =>
    `relative text-red-600 px-3 py-1 rounded transition-colors duration-200
    hover:bg-red-500 hover:text-white
    ${pathname === href ? 'active-link' : ''}`;

  const mobileLinkClass = (href: string) =>
    `block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors
    ${pathname === href ? 'bg-red-50 text-red-700' : ''}`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-red-500 px-4 py-2 flex items-center justify-between z-50 shadow-sm">
      {/* Logo */}
      <div className="text-xl md:text-2xl font-bold text-red-600">CCF Resto</div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-center">
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

      {/* Desktop Right Links */}
      <div className="hidden md:flex gap-4">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <Link href="/cart" className="text-red-600 hover:text-red-700 transition-colors">
          <FaShoppingCart size={20} />
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="text-red-600 hover:text-red-700 transition-colors p-2"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-red-500 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={mobileLinkClass(link.href)}
                    onClick={toggleMobileMenu}
                    scroll={link.href.startsWith('/#')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Right Links */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {rightLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={mobileLinkClass(link.href)}
                    onClick={toggleMobileMenu}
                  >
                    {typeof link.label === 'string' ? link.label : 'Profile'}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// Tailwind CSS: Add this to your globals.css or tailwind.config.js
// .active-link { position: relative; }
// .animate-active-line { animation: activeLine 0.3s; }
// @keyframes activeLine { from { width: 0; } to { width: 100%; } }

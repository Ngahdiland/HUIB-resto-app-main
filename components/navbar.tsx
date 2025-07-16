"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import SessionManager from '@/utils/sessionManager';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/#about', label: 'About', section: 'about' },
  { href: '/#contact', label: 'Contact', section: 'contact' },
];

const rightLinks = [
  { href: '/cart', label: <FaShoppingCart size={18} /> },
  { href: '/profile', label: 'Profile' },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status
  useEffect(() => {
    const sessionManager = SessionManager.getInstance();
    const user = sessionManager.getCurrentUser();
    setCurrentUser(user);
    setIsLoggedIn(!!user);
  }, []);

  // Scrollspy effect
  useEffect(() => {
    if (pathname !== '/') return;
    const handleScroll = () => {
      const sections = ['about', 'contact', 'how-to-order'];
      let found = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            found = section;
            break;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // When clicking a hash link, set activeSection
  const handleNavClick = (section?: string) => {
    if (section) setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    const sessionManager = SessionManager.getInstance();
    sessionManager.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  const linkClass = (href: string, section?: string) => {
    let isActive = false;
    if (href === pathname) {
      isActive = true;
    } else if (href.startsWith('/#')) {
      if (pathname === '/') {
        isActive = activeSection === section;
      }
    }
    return `relative text-red-600 px-3 py-1 rounded transition-colors duration-200
      hover:bg-red-500 hover:text-white
      ${isActive ? 'active-link' : ''}`;
  };

  const mobileLinkClass = (href: string, section?: string) => {
    let isActive = false;
    if (href === pathname) {
      isActive = true;
    } else if (href.startsWith('/#')) {
      if (pathname === '/') {
        isActive = activeSection === section;
      }
    }
    return `block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors
      ${isActive ? 'bg-red-50 text-red-700' : ''}`;
  };

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
              className={linkClass(link.href, link.section)}
              scroll={link.href.startsWith('/#')}
              onClick={() => handleNavClick(link.section)}
            >
              <span className="relative z-10">{link.label}</span>
              {linkClass(link.href, link.section).includes('active-link') && (
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-red-500 rounded transition-all duration-300 animate-active-line" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Right Links */}
      <div className="hidden md:flex gap-4 items-center relative">
        <Link href="/cart" className="text-red-600 hover:text-red-700 transition-colors">
          <FaShoppingCart size={20} />
        </Link>
        
        {isLoggedIn ? (
          <button
            className="flex items-center gap-2 text-red-600 hover:text-red-700 focus:outline-none"
            onClick={() => setShowProfileMenu(v => !v)}
            onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
          >
            <FaUserCircle size={22} />
            <span>{currentUser?.name || 'Profile'}</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <FaUserCircle size={22} />
            <span>Login</span>
          </Link>
        )}
        
        {showProfileMenu && isLoggedIn && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-gray-700"
              onMouseDown={e => {
                e.preventDefault();
                setShowProfileMenu(false);
                router.push('/profile');
              }}
            >
              View Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-red-50 text-gray-700"
              onMouseDown={e => {
                e.preventDefault();
                setShowProfileMenu(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}
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
                    className={mobileLinkClass(link.href, link.section)}
                    onClick={() => handleNavClick(link.section)}
                    scroll={link.href.startsWith('/#')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Right Links */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <button
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full px-4 py-2"
                      onMouseDown={e => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        router.push('/profile');
                      }}
                    >
                      <FaUserCircle size={20} />
                      View Profile
                    </button>
                    <button
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full px-4 py-2"
                      onMouseDown={e => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full px-4 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserCircle size={20} />
                    Login
                  </Link>
                )}
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

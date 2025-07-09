import React from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaCommentDots, FaChartBar, FaMoneyCheckAlt, FaCog, FaStar } from 'react-icons/fa';

const adminLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { href: '/manage-products', label: 'Manage Products', icon: <FaBoxOpen /> },
  { href: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
  { href: '/manage-reviews', label: 'Manage Reviews', icon: <FaStar /> },
  { href: '/feedbacks', label: 'Feedbacks', icon: <FaCommentDots /> },
  { href: '/general-analysys', label: 'General Analysis', icon: <FaChartBar /> },
  { href: '/payments', label: 'Payments', icon: <FaMoneyCheckAlt /> },
  { href: '/settings', label: 'Settings', icon: <FaCog /> },
];

const AdminSidebar = () => (
  <nav className="flex flex-col bg-red-500 gap-2 p-4 h-screen text-white">
    {adminLinks.map(link => (
      <Link
        key={link.href}
        href={link.href}
        className="flex items-center gap-2 px-4 py-2 rounded text-white hover:bg-white hover:text-gray-950 transition-colors border-l-4 border-transparent hover:border-red-500"
      >
        <span className="text-lg">{link.icon}</span>
        <span>{link.label}</span>
      </Link>
    ))}
  </nav>
);

export default AdminSidebar;

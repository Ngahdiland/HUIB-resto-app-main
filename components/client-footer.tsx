import Link from 'next/link'
import React from 'react'
import { FaEnvelope, FaPhone } from 'react-icons/fa'

const ClientFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-3 md:mb-4">HuibApp</h3>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                Your premier food delivery platform. Fast, fresh, and delicious food delivered to your door.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                  <FaPhone />
                </a>
                <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                  <FaEnvelope />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Home</Link></li>
                <li><Link href="/menu" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Menu</Link></li>
                <li><Link href="/#about" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">About</Link></li>
                <li><Link href="/#contact" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="/menu" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Food Delivery</Link></li>
                <li><Link href="/support" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Customer Support</Link></li>
                <li><Link href="/profile" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">My Account</Link></li>
                <li><Link href="/my-orders" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Order History</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/support" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Help Center</Link></li>
                <li><Link href="/support" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Contact Support</Link></li>
                <li><Link href="/support" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Feedback</Link></li>
                <li><Link href="/support" className="text-sm md:text-base text-gray-300 hover:text-red-400 transition-colors">Report Issue</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center max-w-6xl mx-auto">
            <p className="text-sm md:text-base text-gray-300">
              © 2024 HuibApp. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
  )
}

export default ClientFooter

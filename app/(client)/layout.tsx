'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientFooter from '@/components/client-footer';
import Navbar from '@/components/navbar';
import { CartProvider } from '../../context/CartContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-red-600 min-h-screen antialiased">
        <CartProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <ClientFooter />
        </CartProvider>
      </body>
    </html>
  );
}

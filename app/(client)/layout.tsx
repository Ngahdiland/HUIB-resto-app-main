'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientFooter from '@/components/client-footer';
import Navbar from '@/components/navbar';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <ClientFooter />
    </>
  );
}

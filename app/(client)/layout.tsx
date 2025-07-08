'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientFooter from '@/components/client-footer';
import Navbar from '@/components/navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_user='));
    if (!cookie) {
      router.replace('/login');
      return;
    }
    try {
      const user = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      if (user.email === 'ngahdiland@gmail.com') {
        router.replace('/dashboard');
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <html lang="en">
      <body className="bg-white text-red-600 min-h-screen antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <ClientFooter />
      </body>
    </html>
  );
}

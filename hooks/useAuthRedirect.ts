'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'fonyuydiland@gmail.com';

export default function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user && user.email === ADMIN_EMAIL;
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    // Not logged in: only allow login/register
    if (!user && !isAuthPage) {
      router.replace('/login');
      return;
    }
    // Admin: only allow admin routes
    if (user && isAdmin && !isAdminRoute) {
      router.replace('/dashboard');
      return;
    }
    // Regular user: block admin routes
    if (user && !isAdmin && isAdminRoute) {
      router.replace('/');
      return;
    }
    // If logged in and on login/register, redirect to correct section
    if (user && isAuthPage) {
      if (isAdmin) {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [router, pathname]);
} 
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SessionManager from '@/utils/sessionManager';

export default function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const sessionManager = SessionManager.getInstance();
    const user = sessionManager.getCurrentUser();
    const isAdmin = sessionManager.isAdmin(user);
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/manage-') || pathname.startsWith('/payments') || pathname.startsWith('/settings') || pathname.startsWith('/feedbacks') || pathname.startsWith('/general-analysys') || pathname.startsWith('/users');
    const isPublicRoute = pathname === '/' || pathname.startsWith('/menu') || pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/profile');

    // Check if user is in the process of logging out (sessionStorage cleared)
    const currentSessionId = sessionStorage.getItem('huib_current_session');
    const isLoggingOut = !currentSessionId && user;

    // Not logged in: only allow login/register and public routes
    if (!user && !isAuthPage && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    // Admin users: allow admin routes and public routes
    if (user && isAdmin) {
      // If on auth pages, redirect to dashboard
      if (isAuthPage) {
        router.replace('/dashboard');
        return;
      }
      // Allow access to all routes for admin users
      return;
    }

    // Regular users: block admin routes, allow public routes
    if (user && !isAdmin) {
      if (isAdminRoute) {
        router.replace('/');
        return;
      }
      // If on auth pages, redirect to home
      if (isAuthPage) {
        router.replace('/');
        return;
      }
      // Allow access to public routes
      return;
    }
  }, [router, pathname]);
} 
import React from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import AdminHeader from '@/components/admin-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <AdminHeader />
      <div className="flex min-h-screen bg-white">
        <aside className="w-64 border-r border-red-500 bg-white hidden md:block fixed top-0 left-0 h-full z-30 pt-[64px]">
          <AdminSidebar />
        </aside>
        <main className="flex-1 p-8 md:ml-64 mt-[64px]">
          <div className="md:hidden flex items-center justify-center w-full h-[calc(100vh-64px)] text-center text-red-600 text-lg font-semibold">
            Admin management is only available on desktop. Please open on a larger device to edit and manage the system.
          </div>
          <div className="hidden md:block">{children}</div>
        </main>
      </div>
    </div>
  );
}

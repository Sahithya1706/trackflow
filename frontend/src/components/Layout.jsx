import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchPalette from './SearchPalette';
import NotificationBell from './NotificationBell';
import { Menu, Bug } from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Global keyboard-driven search palette */}
      <SearchPalette />

      <main className="flex-1 lg:ml-64 min-w-0 relative overflow-hidden">
        {/* Aesthetic background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

        {/* ── Mobile / Tablet Top Header Bar ── */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <Menu size={22} />
          </button>

          {/* Centered brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <Bug className="text-primary" size={15} />
            </div>
            <span className="text-base font-bold text-white tracking-tight">TrackFlow</span>
          </div>

          {/* Notification bell */}
          <NotificationBell />
        </div>

        {/* ── Desktop Notification Bell (top-right absolute) ── */}
        <div className="hidden lg:flex absolute top-6 right-8 z-[60]">
          <NotificationBell />
        </div>

        {/* Page content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

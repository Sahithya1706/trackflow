import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Settings, 
  LogOut, 
  Bug, 
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/projects', icon: <Layers size={18} /> },
    { name: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={18} />, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const handleNavClick = () => {
    // Close mobile drawer on navigation
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300
        fixed left-0 top-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Branding */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
              <Bug className="text-primary" size={20} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">TrackFlow</h1>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-white p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <p className="px-4 text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-4">Main Menu</p>
          <nav className="space-y-2">
            {links.map((link) => (
              (!link.roles || link.roles.includes(user?.role)) && (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleNavClick}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="text-sm font-semibold">{link.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              )
            ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold border border-white/10 text-xs shadow-md shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); handleNavClick(); }}
              className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-xs font-bold border border-transparent hover:border-red-500/20"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Layers, 
  Ticket, 
  BarChart3,
  Monitor,
  LayoutDashboard
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminProjects from './AdminProjects';
import AdminTickets from './AdminTickets';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Layers size={18} /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket size={18} /> }
  ];

  return (
    <div className="h-full flex flex-col space-y-10 animate-in">
      {/* Admin Navigation Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-primary/20 rounded-xl text-primary border border-primary/20">
                <ShieldCheck size={20} />
             </div>
             <h1 className="text-3xl font-black text-white tracking-tight">Admin Control Center</h1>
           </div>
           <p className="text-slate-500 font-medium ml-12">Manage your platform ecosystem and monitor system performance.</p>
        </div>

        <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 self-start lg:self-center overflow-x-auto no-scrollbar max-w-full">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                 activeTab === tab.id 
                   ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                   : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {tab.icon}
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1">
         {activeTab === 'dashboard' && <AdminDashboard />}
         {activeTab === 'users' && <AdminUsers />}
         {activeTab === 'projects' && <AdminProjects />}
         {activeTab === 'tickets' && <AdminTickets />}
      </div>
    </div>
  );
};

export default AdminPanel;

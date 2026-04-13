import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { 
  Ticket, 
  Search, 
  Filter, 
  Loader2, 
  Bug,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const priorityColors = {
  Low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  High: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  Critical: 'text-red-500 bg-red-500/10 border-red-500/20',
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/tickets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tight">Global Issue Stream</h1>
           <p className="text-slate-500 mt-2 font-medium">Monitoring cross-project technical obstacles.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:min-w-[300px]">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
             <input 
               type="text"
               placeholder="Search tickets..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all shadow-sm"
             />
          </div>
          <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all uppercase tracking-widest cursor-pointer"
          >
             <option value="All">All Status</option>
             <option value="To Do">To Do</option>
             <option value="In Progress">In Progress</option>
             <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-primary mb-4" size={32} />
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Intercepting Packets...</p>
          </div>
        ) : filteredTickets.map(t => (
          <div key={t._id} className="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:border-slate-600 transition-all group flex items-center justify-between gap-6">
             <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-primary shrink-0">
                   <Bug size={18} />
                </div>
                <div className="min-w-0 flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.project?.name || 'Isolated'}</span>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border ${priorityColors[t.priority]}`}>
                        {t.priority}
                      </span>
                   </div>
                   <h4 className="text-white font-bold text-sm truncate">{t.title}</h4>
                </div>
             </div>

             <div className="flex items-center gap-8 shrink-0">
                <div className="hidden md:block">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 text-right">Assignee</p>
                   <p className="text-xs font-bold text-slate-300 text-right">{t.assignee?.name || 'Unassigned'}</p>
                </div>
                <div className="w-28 text-right">
                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                     t.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                     t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                     'bg-slate-900 text-slate-500 border-slate-700'
                   }`}>
                      {t.status === 'Done' ? <CheckCircle2 size={12} /> : t.status === 'In Progress' ? <Clock size={12} /> : <AlertCircle size={12} />}
                      {t.status}
                   </span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTickets;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { 
  Layers, 
  Trash2, 
  Loader2, 
  ExternalLink,
  Target,
  Calendar,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tight">Active Workspaces</h1>
           <p className="text-slate-500 mt-2 font-medium">Monitoring all operational sprint environments.</p>
        </div>
        
        <div className="relative group min-w-[300px]">
           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
           <input 
             type="text"
             placeholder="Search workspaces..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all shadow-sm"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-primary mb-4" size={32} />
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Scanning Databases...</p>
          </div>
        ) : filteredProjects.map(p => (
          <div key={p._id} className="bg-slate-800 border border-slate-700 p-6 rounded-[2rem] hover:border-primary/40 transition-all group relative overflow-hidden shadow-xl">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all" />
             
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center text-primary">
                   <Layers size={24} />
                </div>
                <Link to={`/projects/${p._id}`} className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all">
                   <ExternalLink size={18} />
                </Link>
             </div>

             <h3 className="text-white font-black text-xl mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
             <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-6">Controlled by {p.owner?.name || 'Unknown'}</p>

             <div className="space-y-4 pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                   <Calendar size={14} />
                   <span>Created {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;

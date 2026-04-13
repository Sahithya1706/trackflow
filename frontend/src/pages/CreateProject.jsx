import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/config/api';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Layers, 
  Send,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/api/projects', formData);
      toast.success('Project created successfully!');
      navigate('/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-bold text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 border border-slate-700/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Layers className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Create Project</h1>
            <p className="text-slate-500 font-medium">Define a new environment for your team to build.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Project Name
                <span className="text-primary">*</span>
              </label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="e.g. NextGen Dashboard"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Detailed Description
                <span className="text-primary">*</span>
              </label>
              <textarea 
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white text-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-slate-600 resize-none shadow-inner"
                placeholder="Describe the scope, goals, and core features of this project..."
              />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-700 rounded-2xl p-6 flex items-start gap-4">
            <div className="mt-1">
              <Info className="text-primary" size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Deployment Note</h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">Projects are created as isolated workspaces. You can invite team members and create tickets immediately after creation.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/projects')}
              className="text-slate-500 hover:text-white font-bold transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] text-sm relative"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Launch Project
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProject;

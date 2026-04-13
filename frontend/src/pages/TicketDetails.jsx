import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  Loader2, 
  Bug,
  MessageSquare,
  Paperclip,
  Trash2,
  Plus,
  Send,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Users
} from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: false
});

const priorityColors = {
  Low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  High: 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  Critical: 'text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
};

const statusColors = {
  'To Do': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  'In Progress': 'text-primary bg-primary/10 border-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
  'Done': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        // Assume backend populate project or we just use ticket logic
        const res = await axios.get(`/api/tickets/${ticketId}`);
        setSelectedTicket(res.data);
      } catch (error) {
        console.error("Ticket fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();

    socket.connect();
    socket.emit('joinProject', ticketId);

    socket.on('commentAdded', (newCommentMsg) => {
      if (newCommentMsg.ticket === ticketId || newCommentMsg?.ticket?._id === ticketId) {
        setComments(prev => {
          if (prev.some(c => c._id === newCommentMsg._id)) return prev;
          return [...prev, newCommentMsg];
        });
      }
    });

    return () => {
      socket.off('commentAdded');
      socket.disconnect();
    };
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${ticketId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Comment fetch error", error);
    }
  };

  useEffect(() => {
    if (selectedTicket) {
      fetchComments();
    }
    // eslint-disable-next-line
  }, [selectedTicket]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await axios.post('/api/comments', {
        text: newComment,
        ticketId: selectedTicket._id
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newAttachment = res.data.url;
      const updatedAttachments = [...(selectedTicket.attachments || []), newAttachment];

      await axios.put(`/api/tickets/${selectedTicket._id}`, {
        attachments: updatedAttachments
      });

      setSelectedTicket({ ...selectedTicket, attachments: updatedAttachments });
    } catch (error) {
      alert('Failed to upload manifest image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Ticket...</p>
    </div>
  );

  if (!selectedTicket) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
      <h3 className="text-white font-bold text-xl">Ticket Not Found</h3>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex flex-row items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700/50"
        >
          <ChevronLeft size={14} /> 
          Back to Board
        </button>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <Bug size={12} className="text-primary" />
                ISSUE-{selectedTicket._id?.slice(-4).toUpperCase()}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border ${statusColors[selectedTicket.status] || statusColors['To Do']}`}>
                {selectedTicket.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {selectedTicket.title}
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (70%) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* DESCRIPTION CARD */}
          <div className="rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 md:p-8 hover:shadow-xl hover:shadow-slate-900/50 transition-all duration-300">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
               Technical Observation
             </h3>
             <p className="text-slate-300 text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
               {selectedTicket.description}
             </p>
          </div>

          {/* COLLABORATION / COMMENTS SECTION */}
          <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-6 md:p-8">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <MessageSquare size={16} className="text-slate-600" />
               Collaboration Thread
             </h3>
             
             {/* Comments List */}
             <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar pr-2 pb-4">
                {comments.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 border-2 dashed border-slate-700/50 rounded-2xl">
                    <MessageSquare size={32} className="opacity-20 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest text-center">No discussions yet.</p>
                  </div>
                ) : (
                  comments.map(c => (
                    <div key={c._id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-md animate-in slide-in-from-bottom-2">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-inner uppercase border-2 border-slate-700">
                        {c.user?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-white">{c.user?.name || 'Unknown'}</p>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
             </div>

             {/* Sticky Input */}
             <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-700/50 mt-4">
                <div className="flex items-center gap-3 p-2 rounded-full bg-slate-900 border border-slate-700 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 ml-1">
                     <MessageSquare size={14} className="text-slate-500" />
                   </div>
                   <input 
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none px-2"
                   />
                   <button 
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="p-2.5 mr-1 bg-gradient-to-r from-primary to-indigo-600 rounded-full text-white hover:opacity-90 disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95"
                   >
                      {commentLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                   </button>
                </div>
             </form>
          </div>

        </div>

        {/* RIGHT COLUMN (30%) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* META DATA CARDS */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Status Card */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock size={12} /> Status
              </h4>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${statusColors[selectedTicket.status] || statusColors['To Do']}`}>
                  {selectedTicket.status}
                </span>
                <ChevronLeft size={16} className="text-slate-600 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer delay-75" />
              </div>
            </div>

            {/* Priority Card */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={12} /> Priority
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    selectedTicket.priority === 'High' ? 'bg-orange-500 animate-pulse' : 
                    selectedTicket.priority === 'Critical' ? 'bg-red-500 animate-pulse' : 
                    selectedTicket.priority === 'Low' ? 'bg-blue-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-sm font-bold text-slate-200">{selectedTicket.priority}</span>
                </div>
                <ChevronLeft size={16} className="text-slate-600 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer delay-75" />
              </div>
            </div>

            {/* Assignee Card */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Users size={12} /> Assignee
              </h4>
              
              {selectedTicket.assignee ? (
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-xs font-black text-white shadow-md border border-slate-700">
                      {selectedTicket.assignee.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1">{selectedTicket.assignee.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Developer</p>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-slate-600 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer delay-75" />
                </div>
              ) : (
                <button className="w-full flex items-center justify-between p-2 rounded-lg border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/30 transition-all font-bold text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2"><UserPlus size={14} /> Assign User</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Attachments Card */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Paperclip size={12} /> Attachments
                </h4>
                <label className={`cursor-pointer text-slate-400 hover:text-primary transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                   <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                   {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={16} />}
                </label>
              </div>

              {selectedTicket.attachments && selectedTicket.attachments.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {selectedTicket.attachments.map((url, i) => {
                    const fullUrl = url.startsWith('/uploads') ? `http://localhost:5000${url}` : url;
                    return (
                      <a key={i} href={fullUrl} target="_blank" rel="noreferrer" className="block aspect-video rounded-lg overflow-hidden border border-slate-700 hover:border-primary transition-all group relative cursor-pointer">
                        <img src={fullUrl} alt="Attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Paperclip size={16} className="text-white" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <label className={`w-full py-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-primary/50 bg-slate-900/30 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                   <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                   {uploading ? (
                     <Loader2 size={20} className="animate-spin text-primary mb-2" />
                   ) : (
                     <Paperclip size={20} className="text-slate-500 mb-2" />
                   )}
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     {uploading ? 'Uploading...' : 'Drop files here'}
                   </span>
                </label>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketDetails;

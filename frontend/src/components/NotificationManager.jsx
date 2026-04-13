import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config/api';
import toast, { Toaster } from 'react-hot-toast';
import { Bell, MessageSquare, Ticket, RefreshCw } from 'lucide-react';

const socket = io(API_BASE_URL, {
  transports: ['websocket'],
  autoConnect: true,
  withCredentials: true
});

const NotificationManager = () => {
  useEffect(() => {
    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      
      const getIcon = (type) => {
        switch (type) {
          case 'COMMENT_ADDED': return <MessageSquare size={16} className="text-primary" />;
          case 'TICKET_CREATED': return <Ticket size={16} className="text-green-500" />;
          case 'STATUS_CHANGED': return <RefreshCw size={16} className="text-blue-500" />;
          default: return <Bell size={16} className="text-slate-400" />;
        }
      };

      toast.custom((t) => (
        <div className={`max-w-md w-full bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-300 ${t.visible ? 'animate-in slide-in-from-right-4' : 'animate-out fade-out slide-out-to-right-4'}`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="p-2 bg-slate-800 rounded-xl">
                  {getIcon(data.type)}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">System Alert</p>
                <p className="text-xs font-bold text-slate-200">
                  {data.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-800">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 4000,
        position: 'top-right'
      });
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return <Toaster />;
};

export default NotificationManager;

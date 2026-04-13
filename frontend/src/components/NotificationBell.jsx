import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  Check, 
  X, 
  CheckCheck,
  Loader2,
  UserPlus,
  TicketIcon,
  Layers,
  MessageSquare,
  Info
} from 'lucide-react';

// Singleton socket — reuse the same connection as the rest of the app
const socket = io(API_BASE_URL, {
  transports: ['websocket'],
  autoConnect: false,
});

// Returns icon + color per notification type
const getTypeStyle = (type) => {
  switch (type) {
    case 'project_invite':
      return { icon: <UserPlus size={14} />, color: 'text-primary bg-primary/10 border-primary/20' };
    case 'ticket_assigned':
      return { icon: <TicketIcon size={14} />, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
    case 'ticket_status':
      return { icon: <Layers size={14} />, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
    case 'comment':
      return { icon: <MessageSquare size={14} />, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
    default:
      return { icon: <Info size={14} />, color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' };
  }
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Notification fetch error', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + socket setup
  useEffect(() => {
    fetchNotifications();

    if (user?._id) {
      socket.connect();
      // Join a user-specific room so the server can target this user
      socket.emit('joinUserRoom', user._id);

      socket.on('notification', (data) => {
        setNotifications(prev => {
          // Deduplicate
          if (prev.some(n => n._id === data._id)) return prev;
          return [data, ...prev];
        });
      });
    }

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [user?._id, fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notification) => {
    if (notification.status === 'read') return;
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/${notification._id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev =>
        prev.map(n => n._id === notification._id ? { ...n, status: 'read' } : n)
      );
    } catch (error) {
      console.error('Mark read error', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    } catch (error) {
      console.error('Mark all read error', error);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleAccept = async (notification) => {
    try {
      await axios.post(`${API_BASE_URL}/api/projects/${notification.project?._id}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await handleMarkAsRead(notification);
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error accepting invite');
    }
  };

  const handleReject = async (notification) => {
    try {
      await axios.post(`${API_BASE_URL}/api/projects/${notification.project?._id}/reject`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await handleMarkAsRead(notification);
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting invite');
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all relative group ${
          isOpen
            ? 'bg-primary/10 border-primary/40 text-primary'
            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
        }`}
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out]' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-slate-900 shadow-lg shadow-red-500/30 animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-screen max-w-sm sm:max-w-md lg:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[200] animate-in slide-in-from-top-2 fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-800/40">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-white tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 uppercase tracking-widest">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest disabled:opacity-50"
              >
                {markingAll
                  ? <Loader2 size={12} className="animate-spin" />
                  : <CheckCheck size={12} />
                }
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 size={24} className="animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Bell size={20} className="opacity-30" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">You're all caught up!</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {notifications.map(notification => {
                  const { icon, color } = getTypeStyle(notification.type);
                  const isUnread = notification.status === 'unread';

                  return (
                    <div
                      key={notification._id}
                      onClick={() => handleMarkAsRead(notification)}
                      className={`relative px-5 py-4 cursor-pointer transition-all group hover:bg-slate-800/40 ${isUnread ? 'bg-slate-800/20' : ''}`}
                    >
                      {/* Unread indicator strip */}
                      {isUnread && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Type Icon */}
                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${color}`}>
                          {icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug font-medium ${isUnread ? 'text-white' : 'text-slate-400'}`}>
                            {notification.message}
                          </p>
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">
                            {timeAgo(notification.createdAt)}
                          </p>

                          {/* Project Invite Actions */}
                          {notification.type === 'project_invite' && isUnread && (
                            <div className="flex items-center gap-2 mt-3" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleAccept(notification)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-[11px] font-black py-1.5 rounded-lg transition-all shadow-md shadow-primary/20"
                              >
                                <Check size={12} /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(notification)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-black py-1.5 rounded-lg hover:bg-slate-700 hover:text-white transition-all"
                              >
                                <X size={12} /> Decline
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Read status dot */}
                        {isUnread && (
                          <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-800/20 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {notifications.length} total notifications
              </p>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">
                Real-time ⚡
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

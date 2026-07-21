import React, { useState, useMemo } from 'react';
import { 
  Bell, BellOff, MessageSquare, AlertTriangle, Calendar, ShieldCheck, Mail, 
  MailOpen, Trash2, CheckSquare, Sparkles, AlertCircle, ChevronRight, Play 
} from 'lucide-react';
import { StaffNotification } from '../../lib/staffData';

interface StaffNotificationsProps {
  notifications: StaffNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  onExecuteTask: (taskId: string) => void;
  onReply: (notificationId:string) => void;
}

export default function StaffNotifications({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onExecuteTask,
  onReply
}: StaffNotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread'>('All');

  // Filtered list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === 'Unread') return !n.read;
      return true;
    });
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconForType = (type: StaffNotification['type']) => {
    switch (type) {
      case 'New Assignment':
        return <CheckSquare className="w-4 h-4 text-brand-primary" />;
      case 'Supervisor Message':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      case 'Environmental Alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Schedule Update':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStyleForType = (type: StaffNotification['type']) => {
    switch (type) {
      case 'New Assignment':
        return 'bg-brand-primary/10 border-brand-primary/15';
      case 'Supervisor Message':
        return 'bg-teal-50 border-teal-100';
      case 'Environmental Alert':
        return 'bg-red-50 border-red-100 animate-pulse';
      case 'Schedule Update':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-gray-50 border-gray-150';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Duty Alert Center</h2>
          <p className="text-xs text-gray-400 mt-1">Receive immediate regional dispatches, meteorological alarms, and supervisor approvals.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-4.5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <MailOpen className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filter and control bar */}
      <div className="bg-white rounded-3xl border border-gray-250/80 p-5 shadow-sm flex items-center justify-between">
        
        {/* Toggle options */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('All')}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'All' 
                ? 'bg-white text-brand-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All Messages ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('Unread')}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeFilter === 'Unread' 
                ? 'bg-white text-brand-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Unread Alerts ({unreadCount})
          </button>
        </div>

        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
          Status: Synchronized Live
        </span>

      </div>

      {/* Notifications listing stack */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-gray-250/85 rounded-3xl p-12 text-center space-y-4">
            <BellOff className="w-12 h-12 text-gray-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">Clear notification inbox</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                There are no active dispatch warnings or supervisor logs to report at this moment. You are up to date!
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              className={`bg-white rounded-3xl border p-5 flex items-start gap-4 transition-all hover:shadow-sm ${
                notif.read ? 'border-gray-200/80 opacity-80' : 'border-emerald-100 ring-2 ring-brand-primary/5'
              }`}
            >
              {/* Left icon wrapper */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${getStyleForType(notif.type)}`}>
                {getIconForType(notif.type)}
              </div>

              {/* Center info */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      notif.read ? 'bg-gray-100 text-gray-400' : 'bg-brand-primary/15 text-brand-primary'
                    }`}>
                      {notif.type}
                    </span>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{notif.date}</span>
                </div>

                <h4 className={`text-xs sm:text-sm font-bold text-gray-800 leading-snug`}>
                  {notif.title}
                </h4>
                
                <p className="text-xs text-gray-500 leading-relaxed">
                  {notif.body}
                </p>

                {/* Direct Action Link if task attached */}
                {notif.taskId && (
                  <div className="pt-2">
                    <button
                      onClick={() => onExecuteTask(notif.taskId!)}
                      className="bg-gray-50 hover:bg-brand-primary hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-150 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Execute Dispatch Workflow ({notif.taskId})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {notif.canReply&&<button onClick={()=>onReply(notif.id)} className="mt-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-teal-100 transition-all flex items-center gap-1"><MessageSquare className="w-3 h-3"/>Reply to Supervisor</button>}
              </div>

              {/* Right Action panel */}
              <div className="shrink-0 flex items-center gap-1">
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    className="p-2 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-brand-primary transition-all cursor-pointer"
                    title="Mark as Read"
                  >
                    <MailOpen className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteNotification(notif.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  title="Delete Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

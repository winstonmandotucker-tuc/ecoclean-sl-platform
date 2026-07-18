import React, { useState } from 'react';
import { 
  Bell, Check, Trash2, ShieldAlert, CheckCircle, 
  Clock, Award, Fuel, AlertTriangle, ArrowRight, BookOpen
} from 'lucide-react';
import { SupervisorNotification } from '../../lib/supervisorData';

interface SupervisorNotificationsProps {
  notifications: SupervisorNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  onActionClick: (type: string, referenceId?: string) => void;
}

export default function SupervisorNotifications({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onActionClick
}: SupervisorNotificationsProps) {
  const [filterType, setFilterType] = useState<'All' | 'SLA Alert' | 'Verification Request' | 'New Report' | 'Fuel Request'>('All');

  const filteredNotifs = notifications.filter(n => {
    return filterType === 'All' || n.type === filterType;
  });

  const getNotifIcon = (type: SupervisorNotification['type']) => {
    switch (type) {
      case 'SLA Alert':
        return <FlameIcon />;
      case 'Verification Request':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'New Report':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'Fuel Request':
        return <Fuel className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const FlameIcon = () => (
    <span className="text-red-500 font-extrabold animate-pulse">🔥</span>
  );

  return (
    <div className="space-y-6 animate-fade-in" id="supervisor-notifications-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">Notification Command Center</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track critical operations anomalies, fuel allocations, and quality audit dispatches</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onMarkAllRead}
            disabled={notifications.every(n => n.read)}
            className="px-3.5 py-1.5 bg-white border border-gray-150 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 text-gray-700"
          >
            <Check className="w-4 h-4 text-brand-primary" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200/80 p-1.5 rounded-2xl shadow-sm flex flex-wrap gap-1">
        {(['All', 'SLA Alert', 'Verification Request', 'New Report', 'Fuel Request'] as const).map((type) => {
          const count = type === 'All' ? notifications.length : notifications.filter(n => n.type === type).length;
          const isSelected = filterType === type;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>{type === 'All' ? 'All Alerts' : type}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white text-brand-primary' : 'bg-gray-100 text-gray-600'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List Container */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-4 md:p-6 shadow-sm space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-medium">
            You are fully caught up! No active warnings in this filter slot.
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            return (
              <div 
                key={notif.id} 
                className={`p-4 border rounded-2xl transition-all flex items-start justify-between gap-4 ${
                  notif.read 
                    ? 'bg-white border-gray-150/80 opacity-75' 
                    : 'bg-emerald-50/10 border-emerald-100 shadow-sm'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  {/* Visual Indicator Bubble */}
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                    notif.read ? 'bg-gray-50 border-gray-150' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                        {notif.type}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {notif.date}
                      </span>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      )}
                    </div>

                    <h4 className="text-xs font-black text-gray-900 leading-tight">{notif.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{notif.body}</p>

                    {/* Quick action button within notification box */}
                    {notif.referenceId && (
                      <button
                        onClick={() => onActionClick(notif.type, notif.referenceId)}
                        className="mt-2 text-[10px] font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Open associated workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Operations side tools */}
                <div className="flex gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => onMarkRead(notif.id)}
                      title="Mark as Read"
                      className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-brand-primary rounded-lg border border-transparent hover:border-emerald-100 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteNotification(notif.id)}
                    title="Dismiss alert"
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg border border-transparent hover:border-red-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

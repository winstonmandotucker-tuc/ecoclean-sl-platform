import React from 'react';
import { Bell, Check, Trash2, Calendar, AlertCircle, Info, ChevronRight, CheckCheck } from 'lucide-react';
import { Notification } from '../../lib/citizenData';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onViewReportDetails: (reportId: string) => void;
}

export default function NotificationsList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onViewReportDetails
}: NotificationsListProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Report Update':
        return <CheckCircle2Icon className="w-5 h-5 text-brand-success" />;
      case 'Environmental Alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Community Event':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'Collection Alert':
        return <ClockIcon className="w-5 h-5 text-indigo-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (read: boolean) => {
    return read ? 'bg-white border-gray-200' : 'bg-emerald-50/15 border-brand-accent/50';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="citizen-notifications-panel">
      {/* Notifications Header bar */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Notifications & Alerts</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time critical reports, municipal announcements, and community activity notifications.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-brand-primary bg-brand-accent/20 hover:bg-brand-accent/40 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications stack */}
      <div className="space-y-3.5">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 hover:shadow-sm ${getNotificationBg(
                n.read
              )}`}
            >
              {/* Type Icon indicator */}
              <div className="shrink-0 p-2.5 rounded-xl bg-white border border-gray-150 shadow-inner">
                {getNotificationIcon(n.type)}
              </div>

              {/* Text body and actions */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase">
                    {n.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-medium">{n.date}</span>
                </div>

                <h3 className={`text-xs sm:text-sm font-extrabold ${n.read ? 'text-gray-800' : 'text-gray-950 font-black'}`}>
                  {n.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{n.body}</p>

                {/* Optional navigation link */}
                {n.reportId && (
                  <button
                    onClick={() => onViewReportDetails(n.reportId!)}
                    className="text-xs text-brand-primary font-bold hover:text-brand-success pt-2 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View Related Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Actions: Mark Read, Delete */}
              <div className="flex items-center gap-1.5 shrink-0 self-center">
                {!n.read && (
                  <button
                    onClick={() => onMarkRead(n.id)}
                    title="Mark as Read"
                    className="p-2 text-brand-success hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-100 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(n.id)}
                  title="Delete Notification"
                  className="p-2 text-gray-400 hover:text-brand-error hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 border flex items-center justify-center mx-auto text-gray-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Your inbox is empty</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                You’re all caught up! When local sanitation schedules update or your reports resolve, they will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub components helper for icons to avoid extra modules
function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

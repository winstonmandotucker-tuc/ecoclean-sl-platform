import React from 'react';
import { Sparkles, PlusCircle, FileText, Calendar, Bell, Users, User, ChevronRight, Award, Compass, MessageSquare, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Report, Notification } from '../../lib/citizenData';
import type { User as AuthUser } from '../../types';
import AuthenticatedAvatar from '../AuthenticatedAvatar';

interface CitizenDashboardProps {
  reports: Report[];
  userPoints: number;
  notifications: Notification[];
  onNavigateTab: (tab: 'report' | 'reports' | 'schedules' | 'notifications' | 'community' | 'rewards' | 'profile' | 'report-details') => void;
  onSelectReportId: (id: string) => void;
  user?: AuthUser | null;
}

export default function CitizenDashboard({
  reports,
  userPoints,
  notifications,
  onNavigateTab,
  onSelectReportId,
  user
}: CitizenDashboardProps) {
  // Statistics Calculators
  const reportsSubmitted = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'Pending' || r.status === 'Assigned' || r.status === 'In Progress').length;
  const resolvedReports = reports.filter((r) => r.status === 'Completed' || r.status === 'Verified').length;

  // Recent reports for feed (limit 2)
  const recentReports = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);

  // Critical alerts (Environmental or Announcement)
  const criticalAlerts = notifications.filter((n) => n.type === 'Environmental Alert' || n.type === 'Collection Alert').slice(0, 2);

  return (
    <div className="space-y-8" id="citizen-dashboard-panel">
      
      {/* 1. Welcome Section & Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-emerald-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 translate-y-[-20%] translate-x-[10%] opacity-15 pointer-events-none">
          <Sparkles className="w-64 h-64 text-brand-accent" />
        </div>

        <div className="space-y-3 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freetown Municipal Portal</span>
          </div>
          
          <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-none">
            Welcome back, <span className="text-brand-accent">{user?.fullName}</span>
          </h1>
          <div className="flex items-center gap-3"><AuthenticatedAvatar user={user}/><div><p className="text-xs font-bold text-white">{user?.roleLabel||'Citizen'}</p>{user?.municipality&&<p className="text-[10px] text-emerald-100/80">{user.municipality}</p>}</div></div>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-medium">
            Together we are building a cleaner Sierra Leone. Keep reporting waste, earning rewards, and joining cleanup campaigns.
          </p>
        </div>
      </div>

      {/* 2. Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Reports Submitted */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4.5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block leading-none">Reports Submitted</span>
          <span className="text-2.5xl font-black text-gray-900 block font-mono">{reportsSubmitted}</span>
          <span className="text-[10px] text-gray-400 font-medium block">Total logged</span>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4.5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block leading-none">Pending Tickets</span>
          <span className="text-2.5xl font-black text-amber-600 block font-mono">{pendingReports}</span>
          <span className="text-[10px] text-amber-500 font-medium block">Under investigation</span>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4.5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block leading-none">Resolved Tickets</span>
          <span className="text-2.5xl font-black text-emerald-600 block font-mono">{resolvedReports}</span>
          <span className="text-[10px] text-emerald-500 font-medium block">Verified and closed</span>
        </div>

        {/* Reward Points */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4.5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block leading-none">Reward Balance</span>
          <span className="text-2.5xl font-black text-brand-primary block font-mono">{userPoints}</span>
          <span className="text-[10px] text-brand-secondary font-bold block">Points active</span>
        </div>

        {/* Community Standing */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4.5 shadow-sm space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block leading-none">Salone Ranking</span>
          <span className="text-2.5xl font-black text-gray-900 block font-mono">#14</span>
          <span className="text-[10px] text-gray-400 font-medium block">Out of 4.2k citizens</span>
        </div>
      </div>

      {/* 3. Quick Actions Section (Bento layout) */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Quick Actions</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Action 1: Report Waste */}
          <button
            onClick={() => onNavigateTab('report')}
            className="bg-white hover:bg-emerald-50/15 border border-gray-200 hover:border-brand-primary/30 p-4.5 rounded-2xl text-left transition-all shadow-sm group hover:scale-[1.01] active:scale-95 flex flex-col justify-between h-36 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5 text-brand-secondary" />
            </div>
            <div className="space-y-1 pt-4">
              <span className="text-xs font-bold text-gray-900 block group-hover:text-brand-primary transition-colors">Report Waste</span>
              <p className="text-[10px] text-gray-400 leading-tight">File immediate sanitation issues.</p>
            </div>
          </button>

          {/* Action 2: My Reports */}
          <button
            onClick={() => onNavigateTab('reports')}
            className="bg-white hover:bg-emerald-50/15 border border-gray-200 hover:border-brand-primary/30 p-4.5 rounded-2xl text-left transition-all shadow-sm group hover:scale-[1.01] active:scale-95 flex flex-col justify-between h-36 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-brand-secondary" />
            </div>
            <div className="space-y-1 pt-4">
              <span className="text-xs font-bold text-gray-900 block group-hover:text-brand-primary transition-colors">My Reports</span>
              <p className="text-[10px] text-gray-400 leading-tight">Track, filter & monitor statuses.</p>
            </div>
          </button>

          {/* Action 3: Collection Schedule */}
          <button
            onClick={() => onNavigateTab('schedules')}
            className="bg-white hover:bg-emerald-50/15 border border-gray-200 hover:border-brand-primary/30 p-4.5 rounded-2xl text-left transition-all shadow-sm group hover:scale-[1.01] active:scale-95 flex flex-col justify-between h-36 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-brand-secondary" />
            </div>
            <div className="space-y-1 pt-4">
              <span className="text-xs font-bold text-gray-900 block group-hover:text-brand-primary transition-colors">Collection Slots</span>
              <p className="text-[10px] text-gray-400 leading-tight">Verify schedule days & calendars.</p>
            </div>
          </button>

          {/* Action 4: Notifications */}
          <button
            onClick={() => onNavigateTab('notifications')}
            className="bg-white hover:bg-emerald-50/15 border border-gray-200 hover:border-brand-primary/30 p-4.5 rounded-2xl text-left transition-all shadow-sm group hover:scale-[1.01] active:scale-95 flex flex-col justify-between h-36 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <Bell className="w-5 h-5 text-brand-secondary" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
              )}
            </div>
            <div className="space-y-1 pt-4">
              <span className="text-xs font-bold text-gray-900 block group-hover:text-brand-primary transition-colors">Alerts Inbox</span>
              <p className="text-[10px] text-gray-400 leading-tight">Read news, SLA changes, alerts.</p>
            </div>
          </button>

          {/* Action 5: Community Activities */}
          <button
            onClick={() => onNavigateTab('community')}
            className="bg-white hover:bg-emerald-50/15 border border-gray-200 hover:border-brand-primary/30 p-4.5 rounded-2xl text-left transition-all shadow-sm group hover:scale-[1.01] active:scale-95 flex flex-col justify-between h-36 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-brand-secondary" />
            </div>
            <div className="space-y-1 pt-4">
              <span className="text-xs font-bold text-gray-900 block group-hover:text-brand-primary transition-colors">Volunteering</span>
              <p className="text-[10px] text-gray-400 leading-tight">Sign up for beach & street sweeps.</p>
            </div>
          </button>

          {/* Action 6: Profile */}
          <button
            onClick={() => onNavigateTab('profile')}
            className="bg-white hover:bg-emerald-50/15 border border-gray-200 hover:border-brand-primary/30 p-4.5 rounded-2xl text-left transition-all shadow-sm group hover:scale-[1.01] active:scale-95 flex flex-col justify-between h-36 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-5 h-5 text-brand-secondary" />
            </div>
            <div className="space-y-1 pt-4">
              <span className="text-xs font-bold text-gray-900 block group-hover:text-brand-primary transition-colors">My Profile</span>
              <p className="text-[10px] text-gray-400 leading-tight">Change password, toggle preferences.</p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Lower Columns Grid: Recent Activity & Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Activity Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Your Recent Activity</h3>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-brand-primary hover:text-brand-success text-xs font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentReports.map((rep) => (
              <div key={rep.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                      {rep.referenceNumber}
                    </span>
                    <span className="text-[10px] font-mono text-brand-primary font-bold">{rep.category}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-gray-800 truncate">{rep.title}</h4>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{rep.location}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    rep.status === 'Completed' || rep.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-700'
                      : rep.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {rep.status}
                  </span>
                  <button
                    onClick={() => {
                      onSelectReportId(rep.id);
                      onNavigateTab('report-details');
                    }}
                    className="text-[11px] font-bold text-brand-primary hover:text-brand-success block mt-1.5 hover:underline cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Environmental Alerts & Announcements (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
            <ShieldAlert className="w-5 h-5 text-brand-warning shrink-0" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Critical Alerts</h3>
          </div>

          <div className="space-y-4">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
                    {alert.type}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono font-medium">{alert.date}</span>
                </div>
                <h4 className="text-xs font-black text-gray-900 leading-snug">{alert.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{alert.body}</p>
              </div>
            ))}

            {criticalAlerts.length === 0 && (
              <div className="p-4 bg-gray-50 rounded-2xl text-center text-xs text-gray-400 italic">
                No active environmental alerts at this time. Keep Salone clean!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

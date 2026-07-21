import React from 'react';
import { 
  Users, Trash2, Calendar, ShieldCheck, ArrowUpRight, 
  ArrowDownRight, Bell, Server, FileText, CheckCircle2, AlertTriangle, ChevronRight
} from 'lucide-react';
import { CountryConfig, AuditLog, AdminUser } from '../../lib/adminData';
import { Report } from '../../lib/citizenData';
import type { User as AuthUser } from '../../types';
import AuthenticatedAvatar from '../AuthenticatedAvatar';

interface AdminDashboardProps {
  country: CountryConfig;
  reports: Report[];
  users: AdminUser[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: any) => void;
  user?: AuthUser|null;
}

export default function AdminDashboard({ 
  country, 
  reports, 
  users, 
  auditLogs, 
  onNavigateTab,user
}: AdminDashboardProps) {
  
  // Country specific metrics
  const stats = country.stats;
  
  // Calculate general reports statuses
  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const completedCount = reports.filter(r => r.status === 'Completed' || r.status === 'Verified').length;

  // Filter logs for this country
  const countryLogs = auditLogs.filter(log => log.countryCode === country.code).slice(0, 4);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-[#0E351E] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-brand-primary/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-brand-accent/20 border border-brand-accent/30 px-3 py-1 rounded-full text-brand-accent text-xs font-mono">
            <span>{country.flag} NATIONAL SECRETARIAT OFFICE</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}
          </h1>
          <div className="flex items-center gap-3"><AuthenticatedAvatar user={user}/><div><p className="text-xs font-bold text-white">{user?.roleLabel||'Administrator'}</p>{user?.municipality&&<p className="text-[10px] text-gray-200">{user.municipality}</p>}</div></div>
          <p className="text-gray-200 text-xs md:text-sm leading-relaxed max-w-2xl">
            You are managing ECOCLEAN operations for <span className="text-brand-accent font-bold">{country.name}</span>.
            All municipal councils, staff checklists, and environmental intelligence metrics have adapted to this country's jurisdiction.
          </p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Citizens */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Civic Base</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{stats.activeCitizens.toLocaleString()}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12%</span>
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Registered citizens on mobile portal</p>
        </div>

        {/* Card 2: Waste Collected */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Daily Collection</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-primary flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{stats.dailyWasteCollected} Tons</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+4.2%</span>
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Aggregated municipal skip volume</p>
        </div>

        {/* Card 3: SLA Compliance */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">SLA Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{stats.slaCompliance}%</span>
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              <span>-0.5%</span>
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Completion within designated hours</p>
        </div>

        {/* Card 4: Environmental Agency Link */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Gov Oversight</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-primary flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-bold text-gray-800 line-clamp-1">{country.agencyName.split(' ')[0]}</span>
            <p className="text-[10px] text-gray-400">Jurisdiction Partner Authority</p>
          </div>
          <p className="text-[11px] text-brand-primary font-bold mt-3 hover:underline cursor-pointer flex items-center gap-0.5">
            <span>Audit agency guidelines</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: National Report Breakdown & Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incidents Status Matrix */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">National Incident Matrix</h3>
                <p className="text-xs text-gray-400">Live counts across all municipal registries in {country.name}</p>
              </div>
              <button 
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
              >
                <span>View Registry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-amber-50/50 border border-amber-100/60 rounded-xl p-4 text-center">
                <span className="text-xs text-amber-800 font-mono font-bold uppercase tracking-wider block">Unassigned</span>
                <span className="text-3xl font-black text-amber-950 block mt-1">{pendingCount}</span>
                <span className="text-[10px] text-amber-600 block mt-1">Pending Review</span>
              </div>

              <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-4 text-center">
                <span className="text-xs text-blue-800 font-mono font-bold uppercase tracking-wider block">Active Dispatches</span>
                <span className="text-3xl font-black text-blue-950 block mt-1">{inProgressCount}</span>
                <span className="text-[10px] text-blue-600 block mt-1">Crews En Route</span>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-4 text-center">
                <span className="text-xs text-emerald-800 font-mono font-bold uppercase tracking-wider block">Completed</span>
                <span className="text-3xl font-black text-emerald-950 block mt-1">{completedCount}</span>
                <span className="text-[10px] text-emerald-600 block mt-1">Fully Remediated</span>
              </div>
            </div>

            {/* Quick Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-600">Overall Remediation Progress</span>
                <span className="font-bold text-brand-primary">
                  {reports.length > 0 ? Math.round((completedCount / reports.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${reports.length > 0 ? (completedCount / reports.length) * 100 : 0}%` }}
                />
                <div 
                  className="h-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${reports.length > 0 ? (inProgressCount / reports.length) * 100 : 0}%` }}
                />
                <div 
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${reports.length > 0 ? (pendingCount / reports.length) * 100 : 0}%` }}
                />
              </div>
              <div className="flex gap-4 mt-2 justify-center text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Pending</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> In Progress</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</span>
              </div>
            </div>
          </div>

          {/* Quick Operations Links */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Command Center Quick Launch</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => onNavigateTab('map')}
                className="p-3 text-left border border-gray-100 rounded-xl hover:border-brand-primary hover:bg-emerald-50/10 group transition-all text-gray-700"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-brand-primary/10 group-hover:text-brand-primary flex items-center justify-center mb-2 transition-colors">
                  <span className="text-sm font-bold">GIS</span>
                </div>
                <span className="text-xs font-bold block">GIS Command</span>
                <span className="text-[10px] text-gray-400">Map & Assets</span>
              </button>

              <button 
                onClick={() => onNavigateTab('users')}
                className="p-3 text-left border border-gray-100 rounded-xl hover:border-brand-primary hover:bg-emerald-50/10 group transition-all text-gray-700"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-brand-primary/10 group-hover:text-brand-primary flex items-center justify-center mb-2 transition-colors">
                  <span className="text-sm font-bold">USR</span>
                </div>
                <span className="text-xs font-bold block">User Accounts</span>
                <span className="text-[10px] text-gray-400">Manage Access</span>
              </button>

              <button 
                onClick={() => onNavigateTab('environment')}
                className="p-3 text-left border border-gray-100 rounded-xl hover:border-brand-primary hover:bg-emerald-50/10 group transition-all text-gray-700"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-brand-primary/10 group-hover:text-brand-primary flex items-center justify-center mb-2 transition-colors">
                  <span className="text-sm font-bold">ENV</span>
                </div>
                <span className="text-xs font-bold block">Environmental</span>
                <span className="text-[10px] text-gray-400">Ozone & Carbon</span>
              </button>

              <button 
                onClick={() => onNavigateTab('system-health')}
                className="p-3 text-left border border-gray-100 rounded-xl hover:border-brand-primary hover:bg-emerald-50/10 group transition-all text-gray-700"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-brand-primary/10 group-hover:text-brand-primary flex items-center justify-center mb-2 transition-colors">
                  <span className="text-sm font-bold">SYS</span>
                </div>
                <span className="text-xs font-bold block">System Health</span>
                <span className="text-[10px] text-gray-400">Server Latency</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Country Audit Log feed & Secretariat Action Alert */}
        <div className="space-y-6">
          {/* National Security & Audits Feed */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">National Audit Log</h3>
                <p className="text-xs text-gray-400">Recent high-level activity</p>
              </div>
              <button 
                onClick={() => onNavigateTab('security')}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                View Logs
              </button>
            </div>

            <div className="space-y-4">
              {countryLogs.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No recent actions recorded for this jurisdiction.</p>
              ) : (
                countryLogs.map((log) => (
                  <div key={log.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono text-gray-400">{log.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
                        log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-1 line-clamp-2">
                      {log.action}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono mt-1.5">
                      <span className="truncate max-w-[120px]">{log.userEmail}</span>
                      <span>{log.timestamp.split(' ')[1]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Secretariat Compliance Note */}
          <div className="bg-emerald-50/30 border border-brand-primary/10 rounded-2xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Platform Expansion Compliance</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              This deployment operates within the **ECOCLEAN Sierra Leone governance framework**.
              Data segregation policies are strictly enforced at the container level.
            </p>
            <div className="text-[10px] text-gray-400 font-mono bg-white p-2 rounded-lg border border-gray-100">
              <span className="block font-bold text-gray-700">MFA Enforced: True</span>
              <span className="block">Daily Backup: Active (03:00 UTC)</span>
              <span className="block">Audit Sync: Live Real-Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

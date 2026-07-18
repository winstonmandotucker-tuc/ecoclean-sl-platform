import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, Circle, Clock, ChevronDown, Filter, FileSpreadsheet } from 'lucide-react';
import { Report } from '../../lib/citizenData';
import { CountryConfig } from '../../lib/adminData';
import { reportExportService } from '../../lib/services';

interface ReportManagementCenterProps {
  country: CountryConfig;
  reports: Report[];
  onSaveReports: (newReports: Report[]) => void;
}

export default function ReportManagementCenter({ country, reports, onSaveReports }: ReportManagementCenterProps) {
  const [exporting,setExporting]=useState<string|null>(null);
  const exportReports=async(format:'csv'|'pdf')=>{setExporting(format);try{await reportExportService.download(format,{status:statusFilter,priority:priorityFilter});}finally{setExporting(null);}};
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [muniFilter, setMuniFilter] = useState<string>('all');

  // Selected report for status override modal
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<Report['status']>('Pending');
  const [overridePriority, setOverridePriority] = useState<Report['priority']>('Medium');
  const [overrideTeam, setOverrideTeam] = useState('');

  // Save changes
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    const updated = reports.map(r => {
      if (r.id === editingReport.id) {
        return { 
          ...r, 
          status: overrideStatus, 
          priority: overridePriority,
          assignedTeam: overrideTeam || undefined
        };
      }
      return r;
    });

    onSaveReports(updated);
    setEditingReport(null);
  };

  // Filter logic
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    
    // Check municipal filter
    const matchesMuni = muniFilter === 'all' || r.municipality === muniFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesMuni;
  });

  // Get distinct municipalities in these reports
  const reportMunis = Array.from(new Set(reports.map(r => r.municipality)));

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">National Incident Registry</h2>
          <p className="text-xs text-gray-400 mt-1">
            Centrally oversee citizen environmental reports, status pathways, and override priority assignments.
          </p>
        </div>
        <div className="flex items-center gap-2"><button disabled={!!exporting} onClick={()=>void exportReports('csv')} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 flex items-center gap-2 disabled:opacity-50"><FileSpreadsheet className="w-4 h-4 text-emerald-600"/>{exporting==='csv'?'Exporting…':'Excel CSV'}</button><button disabled={!!exporting} onClick={()=>void exportReports('pdf')} className="px-3 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"><FileSpreadsheet className="w-4 h-4"/>{exporting==='pdf'?'Exporting…':'PDF'}</button></div>
      </div>

      {/* Editing/Override Modal Simulator */}
      {editingReport && (
        <div className="bg-emerald-50/20 border border-brand-primary/15 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-gray-400 bg-white border border-gray-100 px-2.5 py-0.5 rounded uppercase">
                Override Registry: {editingReport.referenceNumber}
              </span>
              <h3 className="text-xs font-black text-gray-800 mt-1 uppercase tracking-wider font-mono">
                {editingReport.title}
              </h3>
            </div>
            <button 
              type="button"
              onClick={() => setEditingReport(null)}
              className="text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Override Status State</label>
              <select 
                value={overrideStatus}
                onChange={e => setOverrideStatus(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              >
                <option value="Pending">Pending (Unassigned)</option>
                <option value="Assigned">Assigned (Crew Appointed)</option>
                <option value="In Progress">In Progress (Active Work)</option>
                <option value="Verified">Verified (Photos Approved)</option>
                <option value="Completed">Completed (Fully Remediated)</option>
                <option value="Rejected">Rejected (Inaccurate Info)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Override Severity Priority</label>
              <select 
                value={overridePriority}
                onChange={e => setOverridePriority(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Severity Priority</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Operational Dispatch Unit</label>
              <input 
                type="text"
                value={overrideTeam}
                onChange={e => setOverrideTeam(e.target.value)}
                placeholder="e.g. Freetown Sanitary Crew Alpha"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button 
                type="submit" 
                className="text-xs font-bold px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary cursor-pointer"
              >
                Commit Changes to Registry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Options */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by reference number, incident description, or specific street location..."
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Verified">Verified</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={muniFilter}
              onChange={e => setMuniFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Councils</option>
              {reportMunis.map((m, idx) => (
                <option key={idx} value={m}>{m.split(' ')[0]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Reference ID</th>
                <th className="p-4">Report Details</th>
                <th className="p-4">Priority</th>
                <th className="p-4">SLA State</th>
                <th className="p-4 pr-6 text-right">Registry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-semibold">
                    No environmental incidents registered under this criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="font-extrabold text-gray-900 block font-mono">{r.id}</span>
                      <span className="text-[9px] text-gray-400 block font-mono">{r.referenceNumber}</span>
                    </td>

                    <td className="p-4 max-w-[280px]">
                      <div>
                        <span className="font-extrabold text-gray-800 block line-clamp-1">{r.title}</span>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{r.location}</p>
                        <div className="flex gap-1.5 items-center mt-1 text-[9px] font-mono text-brand-primary">
                          <span>{r.category}</span>
                          {r.assignedTeam && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500">Crews: {r.assignedTeam}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[9px] font-mono uppercase ${
                        r.priority === 'High' 
                          ? 'bg-red-50 text-red-700 border border-red-100' 
                          : r.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}>
                        {r.priority}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase ${
                          r.status === 'Completed' || r.status === 'Verified'
                            ? 'text-emerald-700'
                            : r.status === 'In Progress'
                            ? 'text-blue-700'
                            : r.status === 'Pending'
                            ? 'text-amber-700'
                            : 'text-gray-500'
                        }`}>
                          {r.status === 'Completed' || r.status === 'Verified' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : r.status === 'In Progress' ? (
                            <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span>{r.status}</span>
                        </span>
                        <span className="text-[9px] text-gray-400 block font-mono">Logged: {r.date}</span>
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => {
                          setEditingReport(r);
                          setOverrideStatus(r.status);
                          setOverridePriority(r.priority);
                          setOverrideTeam(r.assignedTeam || '');
                        }}
                        className="text-[10px] font-mono font-bold px-2.5 py-1.5 bg-gray-50 hover:bg-brand-primary hover:text-white border border-gray-200 hover:border-transparent rounded-lg text-gray-600 transition-all cursor-pointer"
                      >
                        Override Registry
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

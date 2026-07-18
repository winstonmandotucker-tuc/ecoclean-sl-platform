import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Report, WASTE_CATEGORIES } from '../../lib/citizenData';

interface MyReportsProps {
  reports: Report[];
  onViewDetails: (reportId: string) => void;
  onNavigateToReport: () => void;
}

export default function MyReports({ reports, onViewDetails, onNavigateToReport }: MyReportsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Verified', 'Completed', 'Rejected'];

  // Handle Filtering
  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || rep.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || rep.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || rep.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Handle Sorting
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  const getStatusStyle = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Verified':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200/80';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityStyle = (priority: Report['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-amber-600 bg-amber-50';
      case 'Low':
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getProgressPercentage = (status: Report['status']) => {
    switch (status) {
      case 'Pending': return 20;
      case 'Assigned': return 40;
      case 'In Progress': return 65;
      case 'Verified': return 85;
      case 'Completed': return 100;
      case 'Rejected': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6" id="citizen-reports-list-panel">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Your Incident Reports</h2>
          <p className="text-xs text-gray-400 mt-1">
            Track, query, and monitor responses to your reported sanitation problems.
          </p>
        </div>
        <button
          onClick={onNavigateToReport}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
        >
          Report New Issue
        </button>
      </div>

      {/* Query Search / Filter Controls bar */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by ID, location, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 focus:border-brand-primary focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 transition-all focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 focus:border-brand-primary focus:bg-white rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {WASTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative md:col-span-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 focus:border-brand-primary focus:bg-white rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sorter Selector */}
          <div className="relative md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200/80 focus:border-brand-primary focus:bg-white rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none cursor-pointer font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">High Priority</option>
            </select>
          </div>
        </div>

        {/* Status Pills Scroller */}
        <div className="border-t border-gray-100 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer font-bold ${
                selectedStatus === status
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-gray-200/80 hover:bg-gray-100'
              }`}
            >
              {status} {status === 'All' ? `(${reports.length})` : `(${reports.filter(r => r.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid Layout */}
      {sortedReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedReports.map((rep) => {
            const progress = getProgressPercentage(rep.status);
            return (
              <div
                key={rep.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Card Top Block */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                      {rep.referenceNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${getPriorityStyle(rep.priority)}`}>
                      {rep.priority} Priority
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                      {rep.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{rep.category}</p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{rep.location}</span>
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{rep.date}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar and View Details action bottom */}
                <div className="border-t border-gray-100 mt-4.5 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${rep.status === 'Completed' || rep.status === 'Verified' ? 'bg-emerald-500' : rep.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <span className={`text-[11px] font-bold border px-2 py-0.5 rounded-md ${getStatusStyle(rep.status)}`}>
                        {rep.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{progress}% Resolved</span>
                  </div>

                  {/* Progress Indicator Slider */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rep.status === 'Completed' || rep.status === 'Verified'
                          ? 'bg-emerald-500'
                          : rep.status === 'Rejected'
                          ? 'bg-red-500'
                          : 'bg-brand-secondary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onViewDetails(rep.id)}
                      className="text-brand-primary hover:text-brand-success text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 border flex items-center justify-center mx-auto text-gray-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">No matching reports found</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
              Adjust your search term or filter status to find older items, or report a new waste spot now.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSelectedPriority('All');
            }}
            className="text-brand-primary hover:text-brand-success text-xs font-bold bg-brand-primary/5 px-4 py-2 rounded-xl transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Calendar, Clock, AlertTriangle, 
  UserCheck, ArrowRight, X, Image, Fuel, CheckCircle, Navigation, Info, Download
} from 'lucide-react';
import { Report, WASTE_CATEGORIES, DISTRICTS } from '../../lib/citizenData';
import { FieldStaff } from '../../lib/supervisorData';
import { reportExportService, type ReportExportFormat } from '../../lib/services';

interface ReportReviewCenterProps {
  reports: Report[];
  staff: FieldStaff[];
  onAssignReport: (reportId: string, staffId: string, priority: 'Low' | 'Medium' | 'High', notes: string, fuelCode: string) => Promise<void>;
}

export default function ReportReviewCenter({
  reports,
  staff,
  onAssignReport
}: ReportReviewCenterProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(reports[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterDistrict, setFilterDistrict] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dispatch variables
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [assignedPriority, setAssignedPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [fuelAllocation, setFuelAllocation] = useState<string>('15 Liters');
  const [assignmentSuccess, setAssignmentSuccess] = useState<boolean>(false);
  const [assignmentError, setAssignmentError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [exporting,setExporting]=useState<string|null>(null);
  const exportReports=async(format:ReportExportFormat)=>{setExporting(format);try{await reportExportService.download(format,{priority:filterPriority==='All'?undefined:filterPriority});}finally{setExporting(null);}};

  // Filtered reports calculation
  const filteredReports = reports.filter(r => {
    const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || r.priority === filterPriority;
    const matchesDistrict = filterDistrict === 'All' || r.district === filterDistrict;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesDistrict && matchesSearch;
  });

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !selectedStaffId) return;

    // Trigger assign callback
    const fuelCode = `SL-FUL-${Math.floor(1000 + Math.random() * 9000)}`;
    setAssignmentError('');
    setIsAssigning(true);
    try {
      await onAssignReport(
        selectedReport.id,
        selectedStaffId,
        assignedPriority,
        dispatchNotes || `Urgent dispatch for clearing ${selectedReport.title}. Fuel authorized: ${fuelAllocation}.`,
        fuelCode
      );
      setAssignmentSuccess(true);
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : 'The crew assignment could not be saved.');
      return;
    } finally {
      setIsAssigning(false);
    }
    setTimeout(() => {
      setAssignmentSuccess(false);
      // Reset dispatch fields
      setSelectedStaffId('');
      setDispatchNotes('');
    }, 2500);
  };

  // Status color helper
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border border-orange-100';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Verified':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  };

  // Priority color helper
  const getPriorityBadge = (priority: Report['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-600 font-black';
      case 'Medium':
        return 'bg-orange-50 text-orange-600 font-bold';
      case 'Low':
        return 'bg-gray-50 text-gray-600 font-medium';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="report-review-center">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Citizen Report Inbox</h2>
          <p className="text-xs text-gray-500 mt-0.5">Filter, audit, and dispatch collection crews to reported hot-spots</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select disabled={!!exporting} defaultValue="" onChange={event=>{const format=event.target.value as ReportExportFormat;if(format)void exportReports(format);event.currentTarget.value='';}} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-50"><option value="" disabled>{exporting?'Preparing export…':'Export reports'}</option><option value="pdf">Professional PDF</option><option value="xlsx">Microsoft Excel (.xlsx)</option><option value="docx">Microsoft Word (.docx)</option><option value="csv">CSV data</option><option value="json">JSON data</option><option value="geojson">GeoJSON map data</option></select>
          {/* Active stats */}
          <span className="px-3 py-1 bg-white border border-gray-150 rounded-lg text-xs font-mono font-bold text-gray-500">
            Total: <span className="text-gray-900">{filteredReports.length}</span>
          </span>
          <span className="px-3 py-1 bg-orange-50 border border-orange-100 rounded-lg text-xs font-mono font-bold text-orange-600">
            Unassigned: <span className="text-orange-950">{reports.filter(r => r.status === 'Pending').length}</span>
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reference, location or incident title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary rounded-xl"
            />
          </div>

          {/* District filter */}
          <div className="flex items-center gap-1.5 min-w-[150px]">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Districts</option>
              {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="min-w-[150px]">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {WASTE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="min-w-[130px]">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">⚪ Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Left Side: Report List */}
        <div className="lg:col-span-2 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredReports.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-400 font-medium">
              No matching citizen reports found.
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report);
                    setAssignmentSuccess(false);
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-brand-primary/5 border-brand-primary shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                      {report.referenceNumber}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-gray-900 line-clamp-1">
                    {report.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3" /> {report.district}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-extrabold ${getPriorityBadge(report.priority)}`}>
                      {report.priority} Priority
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed View & Dispatch Assignment */}
        <div className="lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm min-h-[500px]">
          {selectedReport ? (
            <div className="space-y-6">
              
              {/* Detailed Header */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-brand-primary tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    REF: {selectedReport.referenceNumber}
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                    {selectedReport.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 font-mono"><Calendar className="w-3.5 h-3.5" /> {selectedReport.date}</span>
                    <span className="flex items-center gap-1 font-mono"><MapPin className="w-3.5 h-3.5" /> {selectedReport.location}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Photos & Info Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Description & Metadata */}
                <div className="space-y-3.5">
                  <div className="space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Category</span>
                    <span className="text-xs font-black text-gray-800">{selectedReport.category}</span>
                  </div>

                  <div className="space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Incident Details</span>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">GIS Position</span>
                      <span className="text-[11px] font-mono font-bold text-gray-700">
                        Lat: {selectedReport.gps.lat}, Lng: {selectedReport.gps.lng}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evidence Image */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Citizen Photo Proof</span>
                  {selectedReport.photos && selectedReport.photos.length > 0 ? (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-[210px] group bg-gray-100">
                      <img 
                        src={selectedReport.photos[0]} 
                        alt="Evidence" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono text-white flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                          <Image className="w-3.5 h-3.5" /> High-Resolution Proof
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded-2xl h-[210px] flex flex-col items-center justify-center text-gray-400 text-center p-6 bg-gray-50/50">
                      <Image className="w-8 h-8 text-gray-300 mb-2 animate-pulse" />
                      <span className="text-xs font-bold block text-gray-500">No Image Attached</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Submitted as text description alert</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Dispatch Action Area (Locked if already Completed/Verified) */}
              {selectedReport.status === 'Completed' || selectedReport.status === 'Verified' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-emerald-950 block">This report has been fully resolved and closed out.</span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">Verified by municipal supervisor audits. Ref: {selectedReport.referenceNumber}</span>
                  </div>
                </div>
              ) : selectedReport.status === 'Assigned' || selectedReport.status === 'In Progress' ? (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-blue-950 block">Dispatch Task is Active in Field Operations.</span>
                    <span className="text-[10px] text-blue-700 block mt-0.5">Assigned to: <span className="font-bold">{selectedReport.assignedTeam || 'San Sanitary Crew'}</span></span>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-5 h-5 text-brand-primary" />
                    <h4 className="text-sm font-extrabold text-gray-900">Authorize Dispatch & Assign Crew</h4>
                  </div>

                  <form onSubmit={handleDispatchSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Select Staff crew */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Assign Operations Crew</label>
                        <select
                          value={selectedStaffId}
                          onChange={(e) => setSelectedStaffId(e.target.value)}
                          required
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary cursor-pointer font-medium text-gray-700"
                        >
                          <option value="">Select Crew Leader...</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.role} - {s.vessel}) [{s.status}]
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Select Priority */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Dispatch SLA Priority</label>
                        <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 border border-gray-150 rounded-xl">
                          {(['Low', 'Medium', 'High'] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setAssignedPriority(p)}
                              className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                                assignedPriority === p
                                  ? 'bg-brand-primary text-white shadow-sm'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Fuel Allocation */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Fuel Allowance Allocation</label>
                        <div className="relative">
                          <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={fuelAllocation}
                            onChange={(e) => setFuelAllocation(e.target.value)}
                            className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer font-medium text-gray-700"
                          >
                            <option value="10 Liters">10 Liters Diesel</option>
                            <option value="15 Liters">15 Liters Diesel</option>
                            <option value="20 Liters">20 Liters Diesel</option>
                            <option value="30 Liters">30 Liters Diesel</option>
                            <option value="45 Liters">45 Liters Diesel</option>
                          </select>
                        </div>
                      </div>

                      {/* Notes / Instructions */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Operational Instructions</label>
                        <input
                          type="text"
                          placeholder="e.g. Bring extra garbage rake, block side lanes..."
                          value={dispatchNotes}
                          onChange={(e) => setDispatchNotes(e.target.value)}
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary rounded-xl"
                        />
                      </div>
                    </div>

                    {assignmentSuccess && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center text-xs font-bold animate-pulse">
                        ✓ Dispatch authorized! Task reference generated & pushed to field staff terminal.
                      </div>
                    )}
                    {assignmentError && <div role="alert" className="p-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-center text-xs font-bold">{assignmentError}</div>}

                    <button
                      type="submit"
                      disabled={!selectedStaffId || assignmentSuccess || isAssigning}
                      className="w-full py-3 bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-100 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isAssigning ? 'Saving Assignment…' : 'Authorize Crew Dispatch & Unlock Route'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
              <AlertTriangle className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-500">No Report Selected</h3>
              <p className="text-xs text-gray-400 mt-1">Click on any citizen report in the left inbox to view details and assign dispatch tasks.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

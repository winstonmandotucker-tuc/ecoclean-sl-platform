import React from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, Compass, CheckCircle2, RefreshCw, AlertTriangle, User, Trash2, Download } from 'lucide-react';
import { Report } from '../../lib/citizenData';

interface ReportDetailsProps {
  report: Report;
  onBack: () => void;
  onDelete?: () => void;
}

export default function ReportDetails({ report, onBack, onDelete }: ReportDetailsProps) {
  const steps = [
    { label: 'Submitted', desc: 'Log verified at Ecoclean database', state: 'submitted' },
    { label: 'Under Review', desc: 'Ward sanitation inspector validating', state: 'review' },
    { label: 'Assigned', desc: 'Assigned to district field crew', state: 'assigned' },
    { label: 'In Progress', desc: 'Active cleanup underway at site', state: 'progress' },
    { label: 'Completed', desc: 'Resolved and closed with photo logs', state: 'completed' }
  ];

  // Map the report status to the current step index
  const getCurrentStepIndex = (status: Report['status']) => {
    switch (status) {
      case 'Pending': return 1; // Under Review
      case 'Assigned': return 2; // Assigned
      case 'In Progress': return 3; // In Progress
      case 'Verified': return 4; // Completed / Verified
      case 'Completed': return 4; // Completed
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getCurrentStepIndex(report.status);

  const getPriorityStyle = (priority: Report['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusStyle = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Verified':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="report-detail-panel">
      {/* Back Button and Reference Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Reports</span>
        </button>

        <div className="flex items-center gap-2">
          {report.status==='Pending'&&onDelete&&<button onClick={onDelete} className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-center gap-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5"/>Delete</button>}
          <span className="text-xs text-gray-400 font-medium">Reference Code:</span>
          <span className="text-sm font-black text-brand-primary font-mono tracking-wider bg-brand-accent/20 px-3 py-1 rounded-lg border border-brand-accent/40">
            {report.referenceNumber}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Info Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-3 pb-5 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold font-mono text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-3 py-1 rounded-full">
                  {report.category}
                </span>
                <span className={`text-xs font-bold font-mono border px-3 py-1 rounded-full ${getPriorityStyle(report.priority)}`}>
                  {report.priority} Priority
                </span>
                <span className={`text-xs font-bold font-mono border px-3 py-1 rounded-full ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {report.title}
              </h1>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Submitted on {report.date}</span>
              </p>
            </div>

            {/* Description paragraph */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Incident Description</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100 font-medium">
                {report.description}
              </p>
            </div>

            {/* Location Specs */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jurisdiction & Location Specifics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-4.5 rounded-2xl border border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">District</span>
                  <span className="text-xs font-bold text-gray-700 block">{report.district}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Municipality</span>
                  <span className="text-xs font-bold text-gray-700 block">{report.municipality}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Ward & Zone</span>
                  <span className="text-xs font-bold text-gray-700 block">{report.ward} &bull; {report.zone}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Specific Spot / Landmark</span>
                  <span className="text-xs font-bold text-gray-700 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* GPS coordinates & Map Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">GPS Coordinates</h4>
                <div className="bg-gray-900 border border-gray-800 text-emerald-400 font-mono text-xs p-3.5 rounded-xl flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>LAT: {report.gps.lat} | LNG: {report.gps.lng}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Team</h4>
                <div className="bg-brand-primary/5 border border-brand-primary/10 text-brand-primary p-3 rounded-xl flex items-center gap-1.5 min-h-[50px]">
                  <User className="w-4 h-4 shrink-0 text-brand-secondary" />
                  <span className="text-xs font-bold truncate">{report.assignedTeam || 'Allocating...'}</span>
                </div>
              </div>
            </div>

            {/* Photos evidence attachment gallery */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Uploaded Evidence</h3>
              {report.photos && report.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group">
                      <img src={photo} alt={`Evidence photo ${idx}`} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                      <a href={`${photo}?download=1`} className="absolute top-2.5 right-2.5 bg-black/60 text-white rounded-lg p-1.5" aria-label={`Download evidence ${idx+1}`}><Download className="w-3.5 h-3.5"/></a>
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white font-mono text-[9px] px-2.5 py-1 rounded font-semibold">
                        IMAGE_LOG_0{idx + 1}.JPG
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl text-center text-xs text-gray-400 italic">
                  No photographic evidence uploaded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Incident Stepper Progress Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Resolution Progress</h3>
              <p className="text-xs text-gray-400 mt-1">
                Live monitoring timeline synced to field crews.
              </p>
            </div>

            {report.status === 'Rejected' ? (
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-brand-error">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-extrabold uppercase">Report Rejected</span>
                </div>
                <p className="text-xs text-red-600 leading-relaxed font-medium">
                  Our sanitary ward inspector reviewed this claim and rejected it. Reason: Out of city sanitation jurisdiction, or invalid/duplicate report.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 border-l border-gray-100 space-y-6 ml-1">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={st.label} className="relative space-y-1">
                      {/* Circle node indicator */}
                      <span
                        className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                          isDone
                            ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/20'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {isDone && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>

                      <div className="space-y-0.5">
                        <span
                          className={`text-xs font-bold block ${
                            isCurrent
                              ? 'text-brand-primary'
                              : isDone
                              ? 'text-gray-700'
                              : 'text-gray-400'
                          }`}
                        >
                          {st.label}
                        </span>
                        <p className="text-[11px] text-gray-400 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick alert tips */}
            <div className="bg-brand-accent/20 border border-brand-accent/40 p-4.5 rounded-2xl flex gap-3 text-emerald-950 text-xs leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0" />
              <div>
                <p className="font-bold">Sanitation SLA Guarantee</p>
                <p className="text-[11px] text-emerald-900/80 mt-0.5">
                  The Secretariat aims to resolve all High Priority tickets within 48 business hours. If delayed, supervisors are automatically alerted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

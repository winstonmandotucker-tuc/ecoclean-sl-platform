import React from 'react';
import { CheckCircle2, Clock, Calendar, ArrowRight, Home, PlusCircle } from 'lucide-react';

interface ReportSuccessProps {
  referenceNumber: string;
  onTrackReport: () => void;
  onSubmitAnother: () => void;
  onReturnDashboard: () => void;
}

export default function ReportSuccess({
  referenceNumber,
  onTrackReport,
  onSubmitAnother,
  onReturnDashboard
}: ReportSuccessProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 text-center space-y-6 shadow-xl relative overflow-hidden" id="report-success-panel">
      {/* Dynamic graphic glow */}
      <div className="absolute top-0 inset-x-0 h-2 bg-brand-primary" />
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-accent/20 rounded-full blur-2xl pointer-events-none" />

      {/* Success Badge */}
      <div className="w-16 h-16 bg-brand-accent/30 text-brand-primary rounded-full flex items-center justify-center mx-auto shadow-inner group">
        <CheckCircle2 className="w-9 h-9 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Report Submitted Successfully
        </h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Thank you! Your civic report has been received and registered at the Ecoclean Secretariat database.
        </p>
      </div>

      {/* Primary Reference Metrics Card */}
      <div className="bg-gray-50/70 rounded-2xl border border-gray-100 p-5 space-y-4 text-left">
        <div>
          <span className="text-[10px] font-mono text-gray-400 font-bold block leading-none uppercase">Reference Code</span>
          <span className="text-lg font-black text-brand-primary font-mono block mt-1 tracking-wider uppercase">
            {referenceNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100/80">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-secondary" />
              <span>SLA Target</span>
            </span>
            <span className="text-xs font-bold text-gray-700 block">48 Hours</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand-secondary" />
              <span>Status</span>
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100/60 px-2 py-0.5 rounded-full inline-block font-mono text-[10px]">
              Pending Review
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA Stack */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onTrackReport}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-brand-primary/10 cursor-pointer text-xs flex items-center justify-center gap-2 group"
        >
          <span>Track Report History</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSubmitAnother}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-gray-400" />
            <span>File Another</span>
          </button>

          <button
            onClick={onReturnDashboard}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-gray-400" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Eco Quote */}
      <p className="text-[10px] text-gray-400 font-mono italic">
        "Clean community, healthy nation."
      </p>
    </div>
  );
}

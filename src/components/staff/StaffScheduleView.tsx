import React, { useState } from 'react';
import { 
  Calendar, List, Clock, Truck, MapPin, CheckCircle2, ChevronRight, 
  Sparkles, RefreshCw, AlertCircle, ChevronLeft, CalendarDays 
} from 'lucide-react';
import { StaffSchedule } from '../../lib/staffData';

interface StaffScheduleViewProps {
  schedules: StaffSchedule[];
  onSyncSchedules: () => void;
}

export default function StaffScheduleView({ schedules, onSyncSchedules }: StaffScheduleViewProps) {
  const [activeView, setActiveView] = useState<'List' | 'Calendar'>('List');
  const [selectedMonth, setSelectedMonth] = useState('July 2026');

  // Simple static days for our mock calendar representation (July 2026)
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const calendarDaysOffset = 2; // July 2026 starts on Wednesday (offset 2 if we start week on Monday)

  // Find if a specific calendar day has a shift
  const getShiftsForDay = (day: number) => {
    const dayStr = `2026-07-${day < 10 ? '0' + day : day}`;
    return schedules.filter(s => s.date === dayStr);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Roster Shifts Calendar</h2>
          <p className="text-xs text-gray-400 mt-1">Review your upcoming municipal collection cycles, safety audits, and landfill shifts.</p>
        </div>

        {/* Sync trigger */}
        <button
          onClick={() => {
            onSyncSchedules();
            alert('Shift records synchronized successfully with Secretariat dispatch server!');
          }}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-4.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Synchronize Roster</span>
        </button>
      </div>

      {/* Selector and Month Switcher */}
      <div className="bg-white rounded-3xl border border-gray-250/80 p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Month switcher */}
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-brand-primary" />
          <h3 className="text-sm font-extrabold text-gray-850 font-mono tracking-tight">{selectedMonth}</h3>
        </div>

        {/* View Switcher toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveView('List')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeView === 'List' 
                ? 'bg-white text-brand-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-850'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Timeline List</span>
          </button>
          <button
            onClick={() => setActiveView('Calendar')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeView === 'Calendar' 
                ? 'bg-white text-brand-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-850'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
        </div>

      </div>

      {/* Conditionally Render views */}
      {activeView === 'List' ? (
        <div className="space-y-4">
          {schedules.map((shift) => {
            const isToday = shift.date === '2026-07-16';
            const isInProgress = shift.status === 'In Progress';
            
            return (
              <div 
                key={shift.id} 
                className={`bg-white rounded-3xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors shadow-sm relative ${
                  isInProgress 
                    ? 'border-brand-accent bg-emerald-50/10' 
                    : isToday 
                    ? 'border-emerald-100' 
                    : 'border-gray-200/80'
                }`}
              >
                {/* Visual date block left */}
                <div className="flex gap-4 items-center min-w-[200px]">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border font-mono ${
                    isInProgress
                      ? 'bg-brand-primary text-brand-accent border-brand-primary'
                      : 'bg-gray-50 text-gray-700 border-gray-150'
                  }`}>
                    <span className="text-[10px] font-bold uppercase leading-none">Jul</span>
                    <span className="text-lg font-black leading-none mt-1">{shift.date.split('-')[2]}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      shift.type === 'High priority cleanup' 
                        ? 'bg-red-50 text-red-600 border border-red-100/40' 
                        : 'bg-emerald-50 text-brand-primary border border-emerald-100/40'
                    }`}>
                      {shift.type}
                    </span>
                    <p className="text-xs font-mono text-gray-400 mt-1">Ref ID: {shift.id}</p>
                  </div>
                </div>

                {/* Center shift metadata */}
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 leading-snug">
                    {shift.title}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{shift.time}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Truck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>Vehicle: {shift.vessel}</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-brand-primary">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>📍 {shift.location}</span>
                    </span>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 flex items-center justify-between md:justify-end">
                  <span className={`text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    isInProgress
                      ? 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse'
                      : shift.status === 'Completed'
                      ? 'bg-emerald-50 text-brand-success'
                      : 'bg-gray-50 text-gray-400 border border-gray-150'
                  }`}>
                    {shift.status}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar View Month Layout */
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Monthly grid */}
          <div className="grid grid-cols-7 gap-3">
            {/* Blank offset cells */}
            {Array.from({ length: calendarDaysOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="aspect-square bg-gray-50/30 rounded-xl" />
            ))}

            {/* Actual day cells */}
            {calendarDays.map((day) => {
              const dayShifts = getShiftsForDay(day);
              const hasShifts = dayShifts.length > 0;
              const hasInProgress = dayShifts.some(s => s.status === 'In Progress');
              
              return (
                <div 
                  key={day} 
                  className={`aspect-square rounded-2xl p-2.5 border text-xs flex flex-col justify-between transition-all duration-200 relative ${
                    day === 16 
                      ? 'bg-brand-primary/5 border-brand-primary/30 ring-2 ring-brand-primary/10' 
                      : hasShifts 
                      ? 'bg-white border-emerald-100 shadow-sm' 
                      : 'bg-white border-gray-150/75 hover:bg-gray-50/50'
                  }`}
                >
                  <span className={`font-mono font-bold leading-none ${
                    day === 16 ? 'text-brand-primary font-black text-sm' : 'text-gray-500'
                  }`}>
                    {day}
                  </span>

                  {/* Render tiny indicator nodes for shifts */}
                  {hasShifts && (
                    <div className="space-y-1">
                      {dayShifts.map((s, idx) => (
                        <div 
                          key={idx} 
                          className={`w-full text-[8px] font-bold px-1.5 py-0.5 rounded truncate ${
                            s.status === 'In Progress' 
                              ? 'bg-amber-100 text-amber-700 font-extrabold animate-pulse' 
                              : s.status === 'Completed'
                              ? 'bg-emerald-50 text-brand-success line-through'
                              : 'bg-brand-accent/30 text-brand-primary'
                          }`}
                          title={`${s.id}: ${s.title}`}
                        >
                          {s.vessel.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tiny active beacon */}
                  {day === 16 && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Calendar footnote legend */}
          <div className="pt-4 border-t border-gray-100 flex items-center gap-4 text-[10px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-brand-accent/30 border rounded" />
              <span>Normal Shift</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-150 border rounded animate-pulse" />
              <span>In Progress Shift</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-50 border rounded" />
              <span>Completed Shift</span>
            </span>
          </div>
        </div>
      )}

    </div>
  );
}

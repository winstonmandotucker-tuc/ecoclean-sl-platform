import React from 'react';
import { 
  ArrowLeft, MapPin, ShieldAlert, Clock, User, UserCheck, Shield, Sparkles, 
  ChevronRight, Play, CheckCircle2, AlertTriangle, FileText, Camera, RefreshCw 
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';

interface TaskDetailsProps {
  task: StaffTask | null;
  onBackToList: () => void;
  onExecuteTask: (taskId: string) => void;
  onAcceptTask: (taskId: string) => void;
  onRejectTask: (taskId: string) => void;
}

export default function TaskDetails({ 
  task, 
  onBackToList, 
  onExecuteTask,
  onAcceptTask,
  onRejectTask
}: TaskDetailsProps) {
  
  if (!task) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
        <h3 className="text-sm font-bold text-gray-800">No task loaded</h3>
        <button onClick={onBackToList} className="text-xs font-bold text-brand-primary underline">
          Return to list
        </button>
      </div>
    );
  }

  const isCompleted = task.status === 'Completed';
  const isAssigned = task.status === 'Assigned';
  const isAccepted = task.status === 'Accepted';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Back button and status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToList}
          className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Assignments</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono font-bold text-gray-400">
          <span>TASK ID: <strong className="text-gray-800 font-bold">{task.id}</strong></span>
          <span>&bull;</span>
          <span>Reference: <strong className="text-brand-primary font-bold">{task.referenceNumber}</strong></span>
        </div>
      </div>

      {/* Main Grid Content (Details Left, Actions Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Detailed Metadata */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Main Title & Urgency block */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-2">
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                task.priority === 'High' 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : task.priority === 'Medium'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {task.priority} Priority Urgency
              </span>

              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isCompleted ? 'bg-emerald-50 text-brand-success' : 'bg-brand-primary/10 text-brand-primary'
              }`}>
                {task.status}
              </span>
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">{task.title}</h1>
              <p className="text-xs text-gray-400 mt-1">Logged on: {task.date} &bull; Sector Zone: {task.zone}</p>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 space-y-2">
              <span className="font-extrabold text-gray-500 uppercase text-[10px] block font-mono">Detailed Issue Statement</span>
              <p className="leading-relaxed">{task.description}</p>
            </div>
          </div>

          {/* Section 2: GIS Location and Municipal sector boundaries */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Regional Bounds & GPS coordinates</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3.5">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block uppercase leading-none">MUNICIPALITY</span>
                  <span className="text-xs font-bold text-gray-800 mt-1 block">{task.municipality}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block uppercase leading-none">DISTRICT AREA</span>
                  <span className="text-xs font-bold text-gray-800 mt-1 block">{task.district}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block uppercase leading-none">WARD / PARISH</span>
                  <span className="text-xs font-bold text-gray-800 mt-1 block">{task.ward}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4.5 border border-gray-100 flex flex-col justify-between space-y-3 min-h-[140px]">
                <div className="flex items-start gap-2">
                  <span className="text-lg text-brand-primary">📍</span>
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 font-bold block">DISPATCH SITE ADDRESS</span>
                    <p className="text-xs font-bold text-gray-800 mt-1 leading-snug">{task.location}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span>LAT: {task.gps.lat}</span>
                  <span>LNG: {task.gps.lng}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Before/After Photo log evidence */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Attachment Logs</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Before photos */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Before Cleanup (Citizen photo logs)</span>
                </span>
                
                <div className="grid grid-cols-2 gap-3.5">
                  {task.photosBefore.length === 0 ? (
                    <div className="col-span-2 bg-gray-50 border border-dashed rounded-xl p-8 text-center text-xs text-gray-400">
                      No initial photo attachments
                    </div>
                  ) : (
                    task.photosBefore.map((p, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-150 shadow-inner group relative">
                        <img 
                          src={p} 
                          alt="Before cleanup log" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* After photos */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>After Cleanup (Staff submission)</span>
                </span>
                
                <div className="grid grid-cols-2 gap-3.5">
                  {task.photosAfter.length === 0 ? (
                    <div className="col-span-2 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400 flex flex-col justify-center items-center gap-1 min-h-[100px]">
                      <Camera className="w-5 h-5 text-gray-300" />
                      <span>Pending Completion log</span>
                    </div>
                  ) : (
                    task.photosAfter.map((p, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-150 shadow-inner group relative">
                        <img 
                          src={p} 
                          alt="After cleanup log" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Operational Log and Notes */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Duty Log Notes</h3>
            <div className="space-y-3">
              {task.notes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No supervisor or operator notes added.</p>
              ) : (
                task.notes.map((note, index) => (
                  <div key={index} className="flex gap-2.5 items-start text-xs">
                    <span className="text-brand-primary mt-0.5">&bull;</span>
                    <p className="text-gray-600 leading-relaxed">{note}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Action Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Assignment Information Card */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Assignment Matrix</h3>
            
            <div className="space-y-3.5 divide-y divide-gray-100">
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-gray-400">Assigned Crew Log</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{task.vesselNo || 'Compactor SL-02'}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-3 py-1">
                <span className="text-gray-400">Assigned Supervisor</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{task.assignedSupervisor}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-3 py-1 font-mono">
                <span className="text-gray-400">Target Deadline</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>{task.deadline}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-3 py-1 font-mono">
                <span className="text-gray-400">Assigned Fuel Roster</span>
                <span className="font-bold text-brand-primary">{task.fuelEstimate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Workflows */}
          <div className="bg-white border border-gray-250 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider font-mono">Dispatch Actions</h3>
            
            {isCompleted ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-3 text-brand-success">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="text-sm font-bold">Assignment Resolved</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  This task is completed and verified by Supervisor {task.assignedSupervisor}. No pending actions.
                </p>
                <button 
                  onClick={onBackToList}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs py-2 rounded-lg"
                >
                  Return to Grid
                </button>
              </div>
            ) : isAssigned ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 leading-normal mb-1">
                  This task is currently assigned to you. You must accept the task in order to unlock optimized route navigation and state logs.
                </p>
                <button
                  onClick={() => onAcceptTask(task.id)}
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Accept Assignment</span>
                </button>
                <button
                  onClick={() => onRejectTask(task.id)}
                  className="w-full bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 font-bold text-xs py-3 rounded-xl transition-colors text-center cursor-pointer"
                >
                  Decline Assignment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-2.5 text-amber-700 text-xs">
                  <Sparkles className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Dispatch Accepted</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">Status: <strong className="text-amber-600 uppercase font-bold">{task.status}</strong></p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Launch the interactive collection workflow. This tracks your progress and fuel diagnostics in real-time.
                </p>

                <button
                  onClick={() => onExecuteTask(task.id)}
                  className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Task Execution</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Informational Tip Card */}
          <div className="bg-brand-accent/20 border border-brand-accent/30 rounded-3xl p-5 text-xs text-emerald-950 space-y-2.5">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-brand-primary flex items-center gap-1 font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Security Protocols</span>
            </span>
            <p className="leading-relaxed">
              Uploads are monitored with GPS timestamps. Confirming cleanups fraudulently will cause instant suspension from the council register.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, ArrowLeftRight, Image, 
  MapPin, Clock, User, AlertTriangle, MessageSquare, ChevronRight, Check, X, ShieldCheck
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';

interface VerificationCenterProps {
  tasks: StaffTask[];
  onApproveVerification: (taskId: string) => void;
  onRejectVerification: (taskId: string, feedback: string) => void;
}

export default function VerificationCenter({
  tasks,
  onApproveVerification,
  onRejectVerification
}: VerificationCenterProps) {
  // Find tasks with status 'Verification Pending'
  const pendingVerificationTasks = tasks.filter(t => t.status === 'Verification Pending' || (t.status === 'Completed' && t.photosAfter.length > 0));
  
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(pendingVerificationTasks[0] || null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [successActionMsg, setSuccessActionMsg] = useState('');

  // Fallback images for "before" and "after" if they are empty
  const defaultBefore = '/assets/demo-waste.svg';
  const defaultAfter = '/assets/demo-waste.svg';

  const handleApprove = () => {
    if (!selectedTask) return;
    onApproveVerification(selectedTask.id);
    setSuccessActionMsg('✓ Task successfully authorized, verified, and closed out!');
    
    setTimeout(() => {
      setSuccessActionMsg('');
      setSelectedTask(null);
      setShowRejectBox(false);
    }, 2000);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !rejectFeedback.trim()) return;

    onRejectVerification(selectedTask.id, rejectFeedback);
    setSuccessActionMsg('🔴 Task declined. Re-execution dispatches sent to crew terminal.');
    setRejectFeedback('');
    
    setTimeout(() => {
      setSuccessActionMsg('');
      setSelectedTask(null);
      setShowRejectBox(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="verification-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Quality Verification Center</h2>
          <p className="text-xs text-gray-500 mt-0.5">Audit field completion photos, review sanitary notes, and authorize formal task closures</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white border border-gray-150 rounded-lg text-xs font-mono font-bold text-gray-500">
            Pending Audits: <span className="text-gray-900">{pendingVerificationTasks.filter(t => t.status === 'Verification Pending').length}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Master Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* Left Side: Tasks waiting for verification */}
        <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {pendingVerificationTasks.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-400 font-medium">
              Excellent! No dispatches currently pending quality checks.
            </div>
          ) : (
            pendingVerificationTasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowRejectBox(false);
                    setSuccessActionMsg('');
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-brand-primary/5 border-brand-primary shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                      REF: {task.referenceNumber}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-100">
                      Audit Req
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-gray-900 line-clamp-1">{task.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-mono">
                    <User className="w-3.5 h-3.5 shrink-0" /> Operator: {task.assignedSupervisor}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[10px]">
                    <span className="text-gray-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {task.district}
                    </span>
                    <span className="text-brand-primary font-bold font-mono">
                      {task.vesselNo}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed Before/After Side-by-Side Audit Locker */}
        <div className="lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm min-h-[500px]">
          {selectedTask ? (
            <div className="space-y-6">
              
              {/* Task info details */}
              <div className="pb-4 border-b border-gray-100 space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  TASK ID: {selectedTask.id}
                </span>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-tight">
                  {selectedTask.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedTask.location} • {selectedTask.municipality}
                </p>
              </div>

              {/* Side by Side Image verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Before Photo */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">1. Before Dispatch state</span>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-[190px] bg-gray-100">
                    <img 
                      src={selectedTask.photosBefore[0] || defaultBefore} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono text-white flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded">
                        🔴 Unclean / Reported State
                      </span>
                    </div>
                  </div>
                </div>

                {/* After Photo */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">2. After Crew Cleaning state</span>
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-200 h-[190px] bg-emerald-50">
                    <img 
                      src={selectedTask.photosAfter[0] || defaultAfter} 
                      alt="After" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono text-white flex items-center gap-1 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/20">
                        🟢 Restored state Proof
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sanitary Notes block */}
              <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl space-y-2 text-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Crew Operation Logs & Notes</span>
                <div className="space-y-1.5">
                  {selectedTask.notes && selectedTask.notes.length > 0 ? (
                    selectedTask.notes.map((note, i) => (
                      <p key={i} className="text-gray-600 font-medium leading-relaxed">• {note}</p>
                    ))
                  ) : (
                    <p className="text-gray-400 font-mono">No operational logs submitted with proofs.</p>
                  )}
                </div>
              </div>

              {successActionMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-center text-xs font-bold animate-pulse">
                  {successActionMsg}
                </div>
              )}

              {/* Action layout */}
              {!successActionMsg && (
                <div className="space-y-4">
                  {showRejectBox ? (
                    <form onSubmit={handleRejectSubmit} className="space-y-3 pt-3 border-t border-gray-100">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Re-execution Feedback instructions</label>
                        <textarea
                          required
                          value={rejectFeedback}
                          onChange={(e) => setRejectFeedback(e.target.value)}
                          placeholder="e.g. After photo is blurry / minor plastic scatters remaining in gutter lane..."
                          className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowRejectBox(false)}
                          className="px-4 py-2 text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                        >
                          Confirm Decline & Dispatch Back
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setShowRejectBox(true)}
                        className="flex-1 py-3 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>Decline & Request Re-execution</span>
                      </button>

                      <button
                        onClick={handleApprove}
                        className="flex-1 py-3 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0 text-brand-accent" />
                        <span>Approve restated state & Close</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
              <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-500">No Task Selected</h3>
              <p className="text-xs text-gray-400 mt-1">Select any dispatch waiting for quality verification on the left panel to trigger side-by-side verification reviews.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

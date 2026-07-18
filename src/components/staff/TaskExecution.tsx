import React, { useRef, useState } from 'react';
import { 
  ArrowLeft, Clock, MapPin, CheckCircle2, ChevronRight, Play, Camera, 
  Upload, FileText, Check, AlertTriangle, HelpCircle, UserCheck, ShieldCheck, Trash2 
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';
import { uploadService } from '../../lib/services';
import { mediaUrl } from '../../lib/api';

interface TaskExecutionProps {
  task: StaffTask | null;
  onBackToDetails: () => void;
  onUpdateStatus: (taskId: string, newStatus: StaffTask['status'], notes: string[], photosAfter: string[]) => void;
}

export default function TaskExecution({ task, onBackToDetails, onUpdateStatus }: TaskExecutionProps) {
  const [activeNotes, setActiveNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [evidenceFiles,setEvidenceFiles]=useState<File[]>([]);
  const fileInput=useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  if (!task) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
        <h3 className="text-sm font-bold text-gray-800">No active dispatch found</h3>
        <button onClick={onBackToDetails} className="text-xs font-bold text-brand-primary underline">
          Return to details
        </button>
      </div>
    );
  }

  // Workflow timeline steps
  const steps: { label: StaffTask['status']; description: string }[] = [
    { label: 'Assigned', description: 'Job registered in Secretariat database' },
    { label: 'Accepted', description: 'Operator accepted and scheduled assignment' },
    { label: 'Traveling', description: 'Collection crew traveling to GPS pins' },
    { label: 'In Progress', description: 'Active trash clearing and bin collection' },
    { label: 'Verification Pending', description: 'Evidence photo logs uploaded' },
    { label: 'Completed', description: 'Supervisor authorized closure' }
  ];

  const currentStepIndex = steps.findIndex(s => s.label === task.status);

  // Transition action label
  const getNextActionLabel = () => {
    switch (task.status) {
      case 'Assigned': return 'Accept and Acknowledge';
      case 'Accepted': return 'Depart to Site';
      case 'Traveling': return 'Arrive and Begin Work';
      case 'In Progress': return 'Submit Completion Logs';
      case 'Verification Pending': return 'Simulate Supervisor Verification';
      default: return '';
    }
  };

  const handleAdvanceStep = async () => {
    let nextStatus: StaffTask['status'] | null = null;
    let addedNotes = [...task.notes];

    switch (task.status) {
      case 'Assigned':
        nextStatus = 'Accepted';
        addedNotes.push('Crew accepted and confirmed dispatch.');
        break;
      case 'Accepted':
        nextStatus = 'Traveling';
        addedNotes.push('Crew departed to GPS coordinates using optimized route.');
        break;
      case 'Traveling':
        nextStatus = 'In Progress';
        addedNotes.push('Crew arrived on-site. Initiated structural rubbish loading.');
        break;
      case 'In Progress':
        if (evidenceFiles.length === 0) {
          alert('You must upload at least one "After Cleanup" evidence photo to submit for verification.');
          return;
        }
        for(const file of evidenceFiles){const {data}=await uploadService.upload('task_evidence',file,{taskId:task.id});const url=mediaUrl(data[0].url);if(url)uploadedPhotos.push(url);}nextStatus = 'Verification Pending';
        addedNotes.push('Cleanup done. After photos submitted for supervisor clearance.');
        if (activeNotes.trim()) addedNotes.push(`Operator Notes: ${activeNotes}`);
        break;
      case 'Verification Pending':
        nextStatus = 'Completed';
        addedNotes.push('Supervisor verified closure. Points dispatched to reporting citizen.');
        break;
      default:
        break;
    }

    if (nextStatus) {
      onUpdateStatus(task.id, nextStatus, addedNotes, uploadedPhotos);
      if (nextStatus === 'Verification Pending') {
        setActiveNotes('');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    addFiles(e.dataTransfer.files);
  };

  const addFiles=(files:FileList|null)=>{if(!files)return;const accepted=Array.from(files).filter(file=>['image/jpeg','image/png','image/webp'].includes(file.type)&&file.size<=8*1024*1024);setEvidenceFiles(current=>[...current,...accepted]);setUploadedPhotos(current=>[...current,...accepted.map(file=>URL.createObjectURL(file))]);};

  const handleDeleteUploadedPhoto = (indexToDelete: number) => {
    URL.revokeObjectURL(uploadedPhotos[indexToDelete]);setEvidenceFiles(prev=>prev.filter((_,idx)=>idx!==indexToDelete));
    setUploadedPhotos(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Back to Details */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBackToDetails}
          className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Task Details</span>
        </button>

        <span className="text-xs font-mono font-bold text-gray-400">
          Task Status: <strong className="text-amber-600 uppercase font-bold">{task.status}</strong>
        </span>
      </div>

      {/* Main Execution Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Workflow Timeline & Steps */}
        <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-mono">Work Progress Tracker</h3>
          
          {/* Vertical progress line stepper */}
          <div className="relative pl-5 space-y-6">
            {/* The vertical divider line */}
            <div className="absolute left-7.5 top-2.5 bottom-2.5 w-0.5 bg-gray-150" />

            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div key={idx} className="relative flex gap-4 text-xs items-start min-h-[50px]">
                  {/* Status Node Circle */}
                  <div className={`absolute -left-[14px] w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors duration-300 ${
                    isPast 
                      ? 'bg-brand-success border-brand-success text-white' 
                      : isActive 
                      ? 'bg-brand-primary border-brand-primary text-brand-accent animate-pulse' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="text-[10px] font-mono font-black">{idx + 1}</span>
                    )}
                  </div>

                  <div className="pl-6 space-y-0.5">
                    <h4 className={`font-bold transition-colors ${
                      isActive ? 'text-brand-primary text-sm' : isPast ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h4>
                    <p className={`text-[11px] leading-normal ${
                      isActive ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Work Action Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Title Banner */}
          <div className="bg-white border border-gray-250/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
            <div>
              <span className="text-[10px] font-mono text-gray-400 font-bold block">OPERATIONAL DISPATCH AREA</span>
              <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight mt-1">{task.title}</h2>
              <p className="text-xs text-gray-400 mt-1">📍 {task.location}</p>
            </div>
          </div>

          {/* Conditional Workflow Action Block */}
          {task.status === 'Completed' ? (
            <div className="bg-white border border-emerald-150 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 text-brand-success border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">Task Completed</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-md mx-auto">
                  The cleanup evidence has been fully synchronized and authorized. The points have been safely dispatched to the civic reporter’s wallet.
                </p>
              </div>
              <button 
                onClick={onBackToDetails}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
              >
                Return to Details
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* If "In Progress", operator must upload evidence and write note before advancing */}
              {task.status === 'In Progress' && (
                <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="space-y-1 pb-4 border-b border-gray-100">
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5 font-mono uppercase">
                      <Camera className="w-4.5 h-4.5 text-brand-primary" />
                      <span>Submit Cleanup Evidence Log</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      You are required to submit at least one post-cleanup verification photo to resolve the dispatch.
                    </p>
                  </div>

                  {/* Photo Drag Drop Box */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col justify-center items-center gap-2.5 cursor-pointer ${
                      isDragOver 
                        ? 'border-brand-primary bg-emerald-50/10 scale-[1.01]' 
                        : 'border-gray-200/80 hover:border-brand-primary/40 hover:bg-gray-50/50'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Drag & Drop "After" photo here</p>
                      <p className="text-[10px] text-gray-400 mt-1">Supports JPG, PNG up to 10MB</p>
                    </div>
                    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={e=>addFiles(e.target.files)}/><button
                      type="button"
                      onClick={()=>fileInput.current?.click()}
                      className="mt-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Browse local photo files
                    </button>
                  </div>

                  {/* Uploaded photo list preview */}
                  {uploadedPhotos.length > 0 && (
                    <div className="space-y-3.5">
                      <span className="text-[11px] font-mono font-bold text-gray-400 block uppercase">Uploaded Post-Cleanup logs ({uploadedPhotos.length})</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {uploadedPhotos.map((url, index) => (
                          <div key={index} className="aspect-square border rounded-2xl overflow-hidden relative group shadow-inner border-gray-150">
                            <img src={url} alt="Uploaded After cleanup" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => handleDeleteUploadedPhoto(index)}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Closure Notes field */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-gray-500 uppercase font-mono block">Closure Notes & Comments</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Completed with 4 sacks of plastics moved to Lungi recycling center. Road traffic reopened safely."
                      value={activeNotes}
                      onChange={(e) => setActiveNotes(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* If Verification Pending, simulate supervisor action */}
              {task.status === 'Verification Pending' && (
                <div className="bg-amber-50/50 border border-amber-150 rounded-3xl p-6 shadow-inner text-xs text-amber-900 space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <span className="font-extrabold text-amber-800">Verification Pending Supervisor Audit</span>
                      <p className="text-gray-500 leading-relaxed mt-1">
                        Your completion photos have been logged. Normally, Inspector <strong className="text-gray-700">{task.assignedSupervisor}</strong> verifies closure physically or via GPS geotags. Reviewers are authorized to trigger a mock simulation of this audit approval below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Advance Step Action Button */}
              <div className="bg-white border border-gray-250 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase">CURRENT OPERATIONAL STATUS</span>
                  <span className="text-xs font-extrabold text-gray-800 mt-0.5 block uppercase tracking-wider">{task.status}</span>
                </div>

                <button
                  onClick={handleAdvanceStep}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-primary/10"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{getNextActionLabel()}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

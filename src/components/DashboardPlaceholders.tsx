import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Camera, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  LogOut, 
  Sparkles, 
  Sliders, 
  Users, 
  Truck, 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle,
  Award,
  BookOpen,
  CheckSquare,
  Activity,
  Layers,
  Terminal,
  RefreshCw,
  Map,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { User as UserType } from '../types';

interface DashboardPlaceholdersProps {
  user: UserType | null;
  activePortal: 'citizen' | 'staff' | 'supervisor' | 'admin';
  onBackToSelection: () => void;
  onLogout: () => void;
}

export default function DashboardPlaceholders({ 
  user, 
  activePortal, 
  onBackToSelection, 
  onLogout 
}: DashboardPlaceholdersProps) {
  
  // Interactive simulations state
  const [mockReports, setMockReports] = useState<any[]>([
    { id: 'R-401', location: 'Kroo Town Road, Freetown', category: 'Illegal Street Dump', status: 'In Progress', date: 'Today' },
    { id: 'R-402', location: 'Congo Town Market, Freetown', category: 'Overflowing Municipal Bin', status: 'Completed', date: 'Yesterday' }
  ]);
  const [reportSuccessModal, setReportSuccessModal] = useState(false);
  const [newCategory, setNewCategory] = useState('Illegal Street Dump');
  const [newLocation, setNewLocation] = useState('Freetown Central');
  const [newDescription, setNewDescription] = useState('');
  
  // Staff states
  const [staffTasks, setStaffTasks] = useState([
    { id: 'T-102', task: 'Clear Congo Town market overflow', zone: 'Zone 4 Freetown', urgency: 'High', status: 'In Progress' },
    { id: 'T-103', task: 'Verify Kroo Town Road dump reduction', zone: 'Zone 4 Freetown', urgency: 'Medium', status: 'Pending' }
  ]);
  const [activeTaskToast, setActiveTaskToast] = useState(false);

  // Admin state
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // Supervisor state
  const [activeTab, setActiveTab] = useState<'map' | 'crews'>('map');

  // Trigger diagnostic audit log simulator
  const runDiagnostics = () => {
    setIsAuditing(true);
    setAuditLogs([]);
    const logs = [
      'Initializing secure ECOCLEAN audit protocol...',
      'Verifying regional boundaries for Bo, Kenema, Makeni, and Freetown...',
      'Scanning local caching directories & state mechanisms: OK',
      'Establishing mock GIS coordinate relay pipeline...',
      'Running security scan on 4 active portals...',
      'SYSTEM HEALTH CODE 200: All Sprint 1 layers fully compliant.'
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setAuditLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsAuditing(false);
        }
      }, (index + 1) * 450);
    });
  };

  const handleCreateMockReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    const newRep = {
      id: `R-${Math.floor(100 + Math.random() * 900)}`,
      location: newLocation,
      category: newCategory,
      status: 'Pending Verification',
      date: 'Just Now'
    };

    setMockReports([newRep, ...mockReports]);
    setNewDescription('');
    setReportSuccessModal(true);
  };

  const handleCompleteTaskSim = (id: string) => {
    setStaffTasks(prev => 
      prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t)
    );
    setActiveTaskToast(true);
    setTimeout(() => setActiveTaskToast(false), 3000);
  };

  // Get current portal details
  const portalName = activePortal.charAt(0).toUpperCase() + activePortal.slice(1);

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans selection:bg-brand-accent selection:text-brand-primary">
      
      {/* Top Banner indicating Preview mode */}
      <div className="bg-amber-600 text-white text-xs px-4 py-2.5 flex items-center justify-between font-medium relative z-30 shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span><strong>SPRINT 1 STAGE:</strong> You are viewing the high-fidelity {portalName} Portal Placeholder interface.</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToSelection}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded text-[10px] font-bold transition-all"
          >
            Switch Portals
          </button>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Sidebar */}
        <aside className="lg:w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
          <div className="space-y-8">
            
            {/* Sidebar Logo */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                <Layers className="w-4.5 h-4.5 text-brand-accent" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-brand-primary block leading-none">ECOCLEAN</span>
                <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase font-semibold">Secretariat</span>
              </div>
            </div>

            {/* Sidebar user badge */}
            <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 font-bold">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{user?.fullName}</p>
                <p className="text-[10px] text-brand-primary font-bold font-mono tracking-wider uppercase mt-0.5">{portalName}</p>
              </div>
            </div>

            {/* Navigation links - with lock icons or preview badges */}
            <nav className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2.5 mb-2">Workspace Menus</span>
              <a className="bg-brand-accent/30 text-brand-primary text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
                <Activity className="w-4 h-4" />
                <span>Executive Overview</span>
              </a>
              <a className="text-gray-400 hover:text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-between cursor-not-allowed">
                <span className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  <span>GIS Map Tracking</span>
                </span>
                <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">LOCKED</span>
              </a>
              <a className="text-gray-400 hover:text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-between cursor-not-allowed">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>District Schedules</span>
                </span>
                <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">LOCKED</span>
              </a>
              <a className="text-gray-400 hover:text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center justify-between cursor-not-allowed">
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>Workspace Settings</span>
                </span>
                <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">LOCKED</span>
              </a>
            </nav>

          </div>

          {/* Sidebar Footer Actions */}
          <div className="pt-6 border-t border-gray-100 space-y-2">
            <button 
              onClick={onBackToSelection}
              className="w-full text-left text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-accent/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace Picker</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full text-left text-xs font-bold text-gray-500 hover:text-brand-error transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

        </aside>

        {/* Main Dashboard Panel */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-brand-success rounded-full animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-brand-primary tracking-wider uppercase">Active Security Session</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
                {portalName} Dashboard
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Securely connected as <span className="text-gray-600 font-semibold">{user?.fullName}</span> &bull; Regional Area Watch
              </p>
            </div>

            {/* Time clock and stats status */}
            <div className="bg-white border border-gray-200/80 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold block leading-none">TIME & DATE (UTC)</span>
                <span className="text-sm font-bold text-gray-800 font-mono block mt-1">2026-07-16 10:00</span>
              </div>
            </div>
          </div>

          {/* ROLE-SPECIFIC WORKSPACE INTERACTIVE FEATURES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Column 1 & 2: Main interactive preview depending on role */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CITIZEN PORTAL FOCUS */}
              {activePortal === 'citizen' && (
                <div className="space-y-8">
                  {/* Green citizen score banner */}
                  <div className="bg-gradient-to-r from-brand-primary to-emerald-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
                    <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 opacity-10 pointer-events-none">
                      <Award className="w-64 h-64" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                      <div className="space-y-2">
                        <span className="bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Citizen Impact Level
                        </span>
                        <h2 className="text-2xl font-black">District Green Advocate</h2>
                        <p className="text-xs text-emerald-100/70 max-w-sm">
                          Earn environmental awards by logging trash points. Points are redeemable for municipal utility credits and local awards.
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center min-w-[120px] shrink-0">
                        <span className="text-3xl font-black text-brand-accent block font-mono">120</span>
                        <span className="text-[10px] font-bold text-emerald-200 block mt-1 tracking-wider uppercase">Active Points</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit mock report panel */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Transmit Mock Waste Report</h3>
                        <p className="text-xs text-gray-400">Simulate filing an incident to test SPRINT 1 workflows.</p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateMockReport} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Incident Category</label>
                          <select 
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
                          >
                            <option value="Illegal Street Dump">Illegal Street Dump</option>
                            <option value="Overflowing Municipal Bin">Overflowing Municipal Bin</option>
                            <option value="Coastal Plastic Blockage">Coastal Plastic Blockage</option>
                            <option value="Hazardous Waste Spillage">Hazardous Waste Spillage</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Municipal Sector / Location</label>
                          <select 
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
                          >
                            <option value="Kroo Town Road, Freetown">Kroo Town Road, Freetown</option>
                            <option value="Congo Town Market, Freetown">Congo Town Market, Freetown</option>
                            <option value="Bo Town Central, Bo">Bo Town Central, Bo</option>
                            <option value="Kenema Market Road, Kenema">Kenema Market Road, Kenema</option>
                            <option value="Makeni Council Line, Makeni">Makeni Council Line, Makeni</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Incident Description & Urgent Flags</label>
                        <textarea 
                          rows={3}
                          required
                          placeholder="e.g., Extensive household plastic bags blockading safe drainage flow near market..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-brand-primary" />
                          <span>Photo-Attachment mock-active</span>
                        </div>
                        <button 
                          type="submit"
                          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Submit Mock Report
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Citizen Reports History */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Your Recent Reports History</h3>
                    <div className="divide-y divide-gray-100">
                      {mockReports.map((rep) => (
                        <div key={rep.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-gray-800">{rep.category}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5">{rep.location} &bull; {rep.date}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                            rep.status.includes('Completed') 
                              ? 'bg-emerald-50 text-brand-success border border-emerald-100' 
                              : rep.status.includes('Verification')
                              ? 'bg-amber-50 text-brand-warning border border-amber-100'
                              : 'bg-green-50 text-brand-primary border border-green-100'
                          }`}>
                            {rep.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STAFF PORTAL FOCUS */}
              {activePortal === 'staff' && (
                <div className="space-y-8">
                  {/* Task list for operators */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Your Dispatched Tasks loop</h3>
                        <p className="text-xs text-gray-400">Review, execute, and verify assigned regional cleanup loops.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {staffTasks.map((t) => (
                        <div 
                          key={t.id} 
                          className={`border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                            t.status === 'Completed' 
                              ? 'border-gray-100 bg-gray-50/50' 
                              : 'border-brand-accent bg-emerald-50/10'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold bg-white border px-1.5 py-0.5 rounded text-gray-500">{t.id}</span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                t.urgency === 'High' ? 'bg-red-50 text-brand-error' : 'bg-amber-50 text-brand-warning'
                              }`}>{t.urgency} Urgency</span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">{t.task}</h4>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                              {t.zone}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {t.status === 'Completed' ? (
                              <span className="bg-brand-success/15 text-brand-success text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verified Done</span>
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleCompleteTaskSim(t.id)}
                                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <span>Verify Completion</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Route progress widget */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Your Vehicle Route Sync Progress</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs text-gray-500 font-semibold">
                        <span>Freetown Route D-4</span>
                        <span>50% Complete</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: '50%' }} />
                      </div>
                      <p className="text-[10px] text-gray-400 italic">GPS tracking and fuel optimization metrics active.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUPERVISOR PORTAL FOCUS */}
              {activePortal === 'supervisor' && (
                <div className="space-y-8">
                  {/* Crew maps controller mockup */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Regional Field Controls</h3>
                        <p className="text-xs text-gray-400 font-medium">Verify crew dispatches across all active Sierra Leone municipal zones.</p>
                      </div>
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                          onClick={() => setActiveTab('map')}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                            activeTab === 'map' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Regional Map
                        </button>
                        <button 
                          onClick={() => setActiveTab('crews')}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                            activeTab === 'crews' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Crews Duty
                        </button>
                      </div>
                    </div>

                    {activeTab === 'map' ? (
                      <div className="bg-gray-950 aspect-video rounded-2xl border border-gray-800 relative overflow-hidden flex flex-col justify-between p-6 text-white">
                        {/* Simulation watermark */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(67,160,71,0.15)_0%,transparent_50%)]" />
                        
                        {/* Fake map coordinates */}
                        <div className="text-right text-[10px] font-mono text-emerald-400">
                          <span>GIS BOUND: FREETOWN WARD 3 - Ward 5</span>
                        </div>

                        {/* Centered locator beacon */}
                        <div className="text-center space-y-3 relative z-10">
                          <div className="relative inline-block">
                            <span className="w-5 h-5 bg-emerald-500 rounded-full animate-ping absolute -inset-1 opacity-75" />
                            <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full relative z-10 border-2 border-black" />
                          </div>
                          <p className="text-xs font-mono font-bold tracking-widest text-emerald-300">3 DISPATCH CREWS ACTIVE ON GRID</p>
                          <p className="text-[10px] text-gray-400">Map updates every 30 seconds automatically</p>
                        </div>

                        {/* Map controls mockup */}
                        <div className="flex gap-2 text-[10px] font-mono bg-white/5 border border-white/10 p-2.5 rounded-xl self-start">
                          <span className="text-emerald-400">● LIVE</span>
                          <span className="text-gray-400">GRID STRENGTH: 98%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-gray-50 border p-4 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-gray-800">Crew Alpha (Makeni Zone 1)</p>
                            <p className="text-gray-400 text-[10px]">Leader: Alpha Conteh &bull; 4 dispatches done today</p>
                          </div>
                          <span className="bg-emerald-50 text-brand-success px-2.5 py-1 rounded-full text-[10px] font-bold">ON ROAD</span>
                        </div>
                        <div className="bg-gray-50 border p-4 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-gray-800">Crew Beta (Bo Sector D)</p>
                            <p className="text-gray-400 text-[10px]">Leader: Isata Kamara &bull; 2 pending tasks</p>
                          </div>
                          <span className="bg-amber-50 text-brand-warning px-2.5 py-1 rounded-full text-[10px] font-bold">MEAL BREAK</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Verification backlog */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Urgent Supervisor Backlog Checklist</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-brand-warning shrink-0" />
                        <span className="text-gray-600 font-semibold">Verify Freetown Market waste overflow claim from Citizen #3048</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" />
                        <span className="text-gray-400 line-through">Confirm Bo landfill weight capacity report</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMINISTRATOR PORTAL FOCUS */}
              {activePortal === 'admin' && (
                <div className="space-y-8">
                  {/* Database Diagnostic Control Panel */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">National Platform Diagnostics</h3>
                        <p className="text-xs text-gray-400">Trigger full security scans and audit state configurations across Bo, Kenema, Makeni, and Freetown.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Trigger button */}
                      <button 
                        onClick={runDiagnostics}
                        disabled={isAuditing}
                        className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
                        <span>{isAuditing ? 'Executing National Diagnostic Audit...' : 'Audit Database Integrity'}</span>
                      </button>

                      {/* Fake Terminal Logs */}
                      {(isAuditing || auditLogs.length > 0) && (
                        <div className="bg-gray-900 text-emerald-400 font-mono text-[11px] p-5 rounded-2xl space-y-1.5 h-48 overflow-y-auto border border-gray-800 shadow-inner">
                          {auditLogs.map((log, index) => (
                            <div key={index} className="flex gap-2">
                              <span className="text-emerald-600 font-bold select-none">&gt;</span>
                              <span>{log}</span>
                            </div>
                          ))}
                          {isAuditing && (
                            <div className="w-3 h-4 bg-emerald-400 animate-pulse ml-4 mt-0.5" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Administrative Districts leaderboards */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Sierra Leone Municipal Resolution Leaderboards</h3>
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-700">Freetown City Council</span>
                        <span className="font-bold text-brand-primary font-mono">92% Resolved (12k Reports)</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-700">Bo City Council</span>
                        <span className="font-bold text-brand-primary font-mono">96% Resolved (4.1k Reports)</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-700">Kenema City Council</span>
                        <span className="font-bold text-brand-primary font-mono">88% Resolved (3.2k Reports)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Column 3: SPRINT 2 ROADMAP CHECKLIST & GOALS */}
            <div className="space-y-8">
              
              {/* Development status board */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-50 text-brand-warning border border-amber-100 font-bold px-3 py-1 rounded-full uppercase font-mono tracking-wide">
                    Sprint 2 Roadmap
                  </span>
                </div>
                
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">National Platform Deployment Path</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Below are SPRINT 2 developmental milestones slated for official national integration.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Splash, Onboarding, Gateways</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Completed in SPRINT 1. Establishes user baseline identity.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-primary/40 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-primary">Automated SMS SMS Relay</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Bypasses network drops via direct GSM codes to supervisors.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-60">
                    <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600">GIS Heatmap Plotters</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Plugs actual geospatial metrics into public sanitation datasets.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-60">
                    <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600">Citizen Token Redeem Store</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Enables exchange of environmental points for utility codes.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-500 leading-relaxed text-center">
                  "Establishing digital sovereignty and environmental transparency for Salone, and beyond."
                </div>
              </div>

              {/* Role Help Info */}
              <div className="bg-brand-accent/20 border border-brand-accent/40 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <HelpCircle className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Evaluation Hub Tips</h4>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Want to inspect how other users interact with ECOCLEAN SL? You can switch workspaces or roles instantly via the <strong>Workspace Picker</strong> action below.
                </p>
                <button
                  onClick={onBackToSelection}
                  className="w-full bg-white hover:bg-brand-accent text-brand-primary font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Switch Portals View</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Interactive simulation success modal */}
      {reportSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setReportSuccessModal(false)}
          />
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative z-10 border border-gray-100 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-brand-accent/35 text-brand-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Mock Incident Registered!</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Your report has been logged locally in SPRINT 1. In SPRINT 2, this triggers automated GIS geotagging and immediate GSM SMS alert dispatches to nearby operators.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 text-xs font-mono text-left space-y-1.5 text-gray-600 border">
              <div><span className="font-bold text-gray-800">Category:</span> {newCategory}</div>
              <div><span className="font-bold text-gray-800">Sector:</span> {newLocation}</div>
              <div><span className="font-bold text-gray-800">Verification Alert:</span> PENDING SMS SYNCHRONIZER</div>
            </div>

            <button 
              onClick={() => setReportSuccessModal(false)}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-md"
            >
              Continue Simulated Session
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast for Staff completions */}
      {activeTaskToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-primary text-white text-xs px-4 py-3 rounded-xl border border-brand-accent/20 shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-brand-accent" />
          <span>Mock task completion logged! Photo validation synchronizing in background.</span>
        </div>
      )}

    </div>
  );
}

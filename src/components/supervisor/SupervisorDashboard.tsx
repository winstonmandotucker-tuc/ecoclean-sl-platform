import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, ShieldCheck, Play, 
  MapPin, Send, PlusCircle, ArrowUpRight, TrendingUp, HelpCircle, ShieldAlert
} from 'lucide-react';
import { Report } from '../../lib/citizenData';
import { StaffTask } from '../../lib/staffData';
import { FieldStaff, RegionPerformance } from '../../lib/supervisorData';
import AuthenticatedAvatar from '../AuthenticatedAvatar';

interface SupervisorDashboardProps {
  user: any;
  reports: Report[];
  tasks: StaffTask[];
  staff: FieldStaff[];
  regions: RegionPerformance[];
  onNavigateTab: (tab: any) => void;
  onDispatchFastCrew: (category: string) => void;
  onSendBroadcast: (message: string) => Promise<void>;
}

export default function SupervisorDashboard({
  user,
  reports,
  tasks,
  staff,
  regions,
  onNavigateTab,
  onDispatchFastCrew,
  onSendBroadcast
}: SupervisorDashboardProps) {
  const [selectedMapDistrict, setSelectedMapDistrict] = useState<string>('Western Urban');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'weather' | 'emergency'>('weather');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcasting,setBroadcasting]=useState(false);const [broadcastError,setBroadcastError]=useState('');

  // Stats calculation
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  
  // High-priority SLA breaches count
  const criticalBreachCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcasting(true);setBroadcastError('');try{await onSendBroadcast(`[${broadcastType.toUpperCase()}] ${broadcastText}`);}catch(cause){setBroadcastError(cause instanceof Error?cause.message:'The broadcast could not be sent.');setBroadcasting(false);return;}
    setBroadcastText('');
    setBroadcastSuccess(true);
    setBroadcasting(false);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  // District details for interactive map highlight
  const districtIncidentCount = (dist: string) => {
    const reportCount = reports.filter(r => r.district.toLowerCase().includes(dist.toLowerCase()) || dist.toLowerCase().includes(r.district.toLowerCase())).length;
    const taskCount = tasks.filter(t => t.district.toLowerCase().includes(dist.toLowerCase()) || dist.toLowerCase().includes(t.district.toLowerCase())).length;
    return reportCount + taskCount;
  };

  const DISTRICT_MAP_NODES = [
    { id: 'freetown', name: 'Western Urban', fullName: 'Western Area Urban (Freetown)', cx: '15%', cy: '45%', r: '14' },
    { id: 'waterloo', name: 'Western Rural', fullName: 'Western Area Rural (Waterloo)', cx: '25%', cy: '55%', r: '12' },
    { id: 'portloko', name: 'Port Loko', fullName: 'Port Loko District', cx: '35%', cy: '35%', r: '18' },
    { id: 'kambia', name: 'Kambia', fullName: 'Kambia District', cx: '30%', cy: '20%', r: '15' },
    { id: 'bombali', name: 'Bombali', fullName: 'Bombali District (Makeni)', cx: '50%', cy: '28%', r: '20' },
    { id: 'kono', name: 'Kono', fullName: 'Kono District (Koidu)', cx: '75%', cy: '42%', r: '22' },
    { id: 'bo', name: 'Bo', fullName: 'Bo District (Bo Central)', cx: '52%', cy: '62%', r: '20' },
    { id: 'kenema', name: 'Kenema', fullName: 'Kenema District', cx: '70%', cy: '65%', r: '22' }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="supervisor-dashboard">
      
      {/* Welcome banner */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-70 -mr-8 -mt-8" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-brand-primary text-[11px] font-bold font-mono tracking-wide uppercase border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" /> Control Center Active
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome Back, {user?.fullName}
          </h1>
          <div className="flex items-center gap-3"><AuthenticatedAvatar user={user}/><div><p className="text-xs font-bold text-gray-800">{user?.roleLabel||'Supervisor'}</p>{user?.municipality&&<p className="text-[10px] text-gray-500">{user.municipality}</p>}</div></div>
          <p className="text-sm text-gray-500 max-w-xl">
            You are overseeing <span className="font-bold text-gray-800">{user?.municipality||user?.district||'your assigned jurisdiction'}</span> and Regional Operations. 
            Keep the city clean, green, and SLA-compliant today.
          </p>
        </div>

        <div className="flex gap-3 shrink-0 relative z-10">
          <button 
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Review Reports</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => onNavigateTab('verification')}
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-brand-accent" />
            <span>Verify Tasks</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider block">Total Reports</span>
            <span className="p-1.5 bg-gray-50 rounded-lg"><Clock className="w-4 h-4 text-gray-400" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{totalReports}</h3>
            <span className="text-[10px] text-gray-400 font-medium block mt-1.5">Submitted via Citizen Portal</span>
          </div>
        </div>

        {/* Card 2 */}
        <button 
          onClick={() => onNavigateTab('reports')}
          className="text-left bg-white border border-gray-200/80 hover:border-emerald-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider block">Pending Team Assign</span>
            <span className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-100"><AlertTriangle className="w-4 h-4 text-orange-500" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-orange-600 leading-none">{pendingReports}</h3>
            <span className="text-[10px] text-orange-500 font-bold block mt-1.5 flex items-center gap-0.5">
              Needs Dispatch <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        {/* Card 3 */}
        <button 
          onClick={() => onNavigateTab('assignments')}
          className="text-left bg-white border border-gray-200/80 hover:border-emerald-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider block">Active Dispatches</span>
            <span className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100"><Play className="w-4 h-4 text-blue-500" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-blue-600 leading-none">{activeTasks}</h3>
            <span className="text-[10px] text-gray-400 font-medium block mt-1.5">Currently active in field</span>
          </div>
        </button>

        {/* Card 4 */}
        <button 
          onClick={() => onNavigateTab('sla')}
          className="text-left bg-white border border-gray-200/80 hover:border-emerald-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider block">SLA Compliance</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg group-hover:bg-emerald-100"><ShieldCheck className="w-4 h-4 text-emerald-600" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-600 leading-none">92.4%</h3>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Exceeding Target (90%)
            </span>
          </div>
        </button>

        {/* Card 5 */}
        <button 
          onClick={() => onNavigateTab('verification')}
          className="text-left bg-white border border-gray-200/80 hover:border-emerald-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start w-full">
            <span className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider block">Resolved Today</span>
            <span className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-emerald-50"><CheckCircle className="w-4 h-4 text-emerald-500" /></span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-800 leading-none">{completedTasksCount}</h3>
            <span className="text-[10px] text-gray-400 font-medium block mt-1.5">Authorized for closure</span>
          </div>
        </button>

      </div>

      {/* Main Grid: Interactive Map & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Map of Operations */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-gray-800">Operational GIS Monitor</h3>
                <p className="text-xs text-gray-500 mt-0.5">Sierra Leone district-level incident clusters & vessel routing tracking</p>
              </div>
              <div className="bg-gray-50 border border-gray-150 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-wide text-brand-primary">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Regional Clusters
              </div>
            </div>

            {/* Selected District Info */}
            <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-4 mt-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block font-mono">Selected Region</span>
                <span className="text-xs font-black text-gray-800">
                  {DISTRICT_MAP_NODES.find(d => d.name === selectedMapDistrict)?.fullName || selectedMapDistrict}
                </span>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block font-mono">Incident Density</span>
                  <span className="text-xs font-black text-brand-primary">
                    {districtIncidentCount(selectedMapDistrict)} cases
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block font-mono">Compliance</span>
                  <span className="text-xs font-black text-emerald-600">
                    {selectedMapDistrict === 'Western Urban' ? '94%' : selectedMapDistrict === 'Bo' ? '88%' : '90%'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SVG Vector Map */}
          <div className="relative border border-dashed border-gray-200 rounded-2xl bg-slate-900 overflow-hidden h-[340px] flex items-center justify-center p-4">
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
            
            {/* SVG Representation of Sierra Leone boundaries */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full max-w-lg transition-transform hover:scale-[1.02]"
              id="sierra-leone-gis-vector"
            >
              {/* Fake background landmass polygon of Sierra Leone */}
              <polygon 
                points="10,40 12,25 25,12 45,15 65,10 80,18 90,30 92,50 85,75 65,85 50,92 35,80 15,70 12,55" 
                fill="#0f172a" 
                stroke="#1e293b" 
                strokeWidth="1.5"
              />
              
              <polygon 
                points="12,38 15,22 23,15 42,18 60,14 78,20 88,32 90,48 83,72 63,82 48,89 33,78 17,68 14,52" 
                fill="#1e293b" 
                stroke="#334155" 
                strokeWidth="0.8"
                className="opacity-90"
              />

              {/* Display connection route lines between nodes */}
              <line x1="15%" y1="45%" x2="25%" y2="55%" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
              <line x1="25%" y1="55%" x2="35%" y2="35%" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
              <line x1="35%" y1="35%" x2="50%" y2="28%" stroke="#eab308" strokeWidth="0.5" strokeDasharray="1,1" />
              <line x1="50%" y1="28%" x2="75%" y2="42%" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1,1" />
              <line x1="50%" y1="28%" x2="52%" y2="62%" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
              <line x1="52%" y1="62%" x2="70%" y2="65%" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />

              {/* Render interactive district circles */}
              {DISTRICT_MAP_NODES.map((node) => {
                const isActive = selectedMapDistrict === node.name;
                const incidentCount = districtIncidentCount(node.name);
                let colorClass = '#10b981'; // Green (Safe)
                if (incidentCount > 2) colorClass = '#f43f5e'; // Red (Critical Overflow)
                else if (incidentCount > 0) colorClass = '#eab308'; // Yellow (Warning)

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedMapDistrict(node.name)}
                  >
                    {/* Ring highlight */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={Number(node.r) + 4} 
                      fill="transparent" 
                      stroke={isActive ? '#10b981' : 'transparent'} 
                      strokeWidth="1.5"
                      className="transition-all duration-300" 
                    />
                    {/* Pulsing halo for hotspot districts */}
                    {incidentCount > 2 && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r={Number(node.r) + 2} 
                        fill="none" 
                        stroke="#f43f5e" 
                        strokeWidth="1"
                        className="animate-ping origin-center" 
                      />
                    )}
                    {/* District body */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.r} 
                      fill={isActive ? '#022c22' : '#0f172a'} 
                      stroke={isActive ? '#10b981' : '#475569'} 
                      strokeWidth={isActive ? '2' : '1'} 
                      className="transition-all duration-300 hover:fill-emerald-950"
                    />
                    {/* Case counter pill inside bubble */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r="4" 
                      fill={colorClass} 
                    />
                    {/* Text Label */}
                    <text 
                      x={node.cx} 
                      y={parseFloat(node.cy) - parseFloat(node.r) - 2 + '%'} 
                      fill={isActive ? '#10b981' : '#94a3b8'} 
                      fontSize="5" 
                      fontWeight={isActive ? 'black' : 'normal'} 
                      textAnchor="middle" 
                      className="font-mono tracking-tight pointer-events-none select-none"
                    >
                      {node.name} ({incidentCount})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-[9px] text-gray-400 font-mono space-y-1">
              <span className="font-extrabold uppercase text-white tracking-widest block mb-1">GIS Map Legend</span>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> <span>Hotspot (&gt;2 cases)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#eab308]" /> <span>Warnings (1-2 cases)</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> <span>Nominal (0 cases)</span></div>
            </div>

            {/* Click to zoom helper */}
            <div className="absolute top-3 right-3 text-[9px] bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-lg text-gray-400 font-mono flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Click district to inspect
            </div>
          </div>
          
          {/* Legend / bottom explanation */}
          <div className="text-[11px] text-gray-500 font-medium">
            💡 <span className="font-bold text-gray-700">Did you know?</span> Western Area (Freetown) generates over 65% of reports. Clicking any region triggers filter updates across reports and active crew allocations automatically.
          </div>
        </div>

        {/* Column 3: Live Broadcast & Fast Operations Actions */}
        <div className="space-y-6">
          
          {/* Quick Operations Actions */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider font-mono">Quick Response Dispatches</h3>
            <p className="text-xs text-gray-500">Instantly trigger standby cleaning vehicles for urgent environmental challenges.</p>
            
            <div className="space-y-2">
              <button 
                onClick={() => onDispatchFastCrew('Drainage Plastic Blockage')}
                className="w-full p-3 bg-gray-50 border border-gray-150 hover:bg-emerald-50 hover:border-emerald-200 text-left rounded-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-800 block">Clear Blocked Gutter</span>
                  <span className="text-[10px] text-gray-400 font-mono">Dispatches Drain-Hook SL-09</span>
                </div>
                <div className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-brand-primary group-hover:text-emerald-600 shadow-sm transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => onDispatchFastCrew('Overflowing Municipal Bin')}
                className="w-full p-3 bg-gray-50 border border-gray-150 hover:bg-emerald-50 hover:border-emerald-200 text-left rounded-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-800 block">Empty Market Overflow Bin</span>
                  <span className="text-[10px] text-gray-400 font-mono">Dispatches Compactor SL-02</span>
                </div>
                <div className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-brand-primary group-hover:text-emerald-600 shadow-sm transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => onDispatchFastCrew('Coastal Plastic Blockage')}
                className="w-full p-3 bg-gray-50 border border-gray-150 hover:bg-emerald-50 hover:border-emerald-200 text-left rounded-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-800 block">Lungi/Aberdeen Beach Cleanup</span>
                  <span className="text-[10px] text-gray-400 font-mono">Dispatches Coast Cleanup Pickup SL-33</span>
                </div>
                <div className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-brand-primary group-hover:text-emerald-600 shadow-sm transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Broadcast Center */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider font-mono">Operations Broadcast</h3>
            </div>
            <p className="text-xs text-gray-500">Send high-priority warning notifications instantly to all field operators and citizen inboxes.</p>
            
            <form onSubmit={handleBroadcastSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Broadcast Alert Type</label>
                <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 border border-gray-150 rounded-xl">
                  {(['info', 'weather', 'emergency'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBroadcastType(type)}
                      className={`py-1 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                        broadcastType === type
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono mb-1.5">Alert Message Body</label>
                <textarea
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="e.g. Heavy rainfall warnings in Freetown, please cover compactor trucks..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary bg-gray-50 min-h-[80px]"
                />
              </div>

              {broadcastSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-center text-[10px] font-bold animate-pulse">
                  ✓ Message transmitted to all regional cells!
                </div>
              )}
              {broadcastError&&<div role="alert" className="p-2 bg-red-50 text-red-700 border border-red-100 rounded-lg text-center text-[10px] font-bold">{broadcastError}</div>}

              <button
                type="submit"
                disabled={!broadcastText.trim()||broadcasting}
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-200 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{broadcasting?'Transmitting…':'Transmit Broadcast Alert'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

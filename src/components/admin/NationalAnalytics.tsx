import React, { useState, useEffect, useMemo } from 'react';
import { operationalStore } from '../../lib/operationalStore';
import { 
  BarChart3, TrendingUp, MapPin, Users, Award, AlertTriangle, 
  Calendar, Download, Search, Filter, Plus, Trash2, Play, 
  CheckCircle, Clock, ArrowUpRight, Zap, ShieldAlert, Eye, 
  HelpCircle, Activity, FileText, Lightbulb, Layers, Settings, 
  Flame, Map, Compass, FileSpreadsheet, Sparkles, RefreshCw, 
  Target, LineChart, PieChart, ListOrdered, User, AlertOctagon,
  ChevronRight, ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryConfig } from '../../lib/adminData';

interface NationalAnalyticsProps {
  country: CountryConfig;
}

// Full 12 route-like sub-tabs
type SubTab = 
  | 'national'
  | 'municipalities'
  | 'districts'
  | 'environment'
  | 'performance'
  | 'predictions'
  | 'hotspots'
  | 'reports'
  | 'leaderboards'
  | 'kpis'
  | 'live'
  | 'ai-ready';

interface KPI {
  id: string;
  title: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  status: 'On Track' | 'At Risk' | 'Critical';
}

interface LiveLog {
  id: string;
  timestamp: string;
  type: 'incident' | 'dispatch' | 'alert' | 'muni';
  message: string;
  source: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function NationalAnalytics({ country }: NationalAnalyticsProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('national');

  // Interactive State 1: KPI Management
  const [kpis, setKpis] = useState<KPI[]>(() => {
    const saved = operationalStore.getItem('ecoclean_kpis');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'KPI-01', title: 'National Collection Frequency', metric: 'SLA Speed', target: 95, current: 88.5, unit: '% Compliance', category: 'Operational', status: 'At Risk' },
      { id: 'KPI-02', title: 'Single-Use Plastic Mitigation', metric: 'Recovery Rate', target: 45, current: 36.2, unit: '% Recycled', category: 'Environmental', status: 'On Track' },
      { id: 'KPI-03', title: 'Average Incident Triage Speed', metric: 'Response Time', target: 3.5, current: 4.2, unit: 'Hours', category: 'Citizen Service', status: 'At Risk' },
      { id: 'KPI-04', title: 'Landfill Leachate Saturation', metric: 'Environmental Runoff', target: 15, current: 22.4, unit: 'ppm', category: 'Risk Management', status: 'Critical' }
    ];
  });

  const [newKpiTitle, setNewKpiTitle] = useState('');
  const [newKpiCategory, setNewKpiCategory] = useState('Operational');
  const [newKpiTarget, setNewKpiTarget] = useState(80);
  const [newKpiUnit, setNewKpiUnit] = useState('%');

  // Interactive State 2: Predictive Scenario Sliders
  const [populationGrowth, setPopulationGrowth] = useState(2.4); // annual percentage
  const [commercialIndex, setCommercialIndex] = useState(1.1); // scaling index factor
  const [rainfallAnomaly, setRainfallAnomaly] = useState(15); // percentage variance

  // Interactive State 3: Executive Reporting Center Progress Simulator
  const [reportPeriod, setReportPeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [reportScope, setReportScope] = useState<'National' | 'Freetown' | 'Bo' | 'Kenema' | 'Makeni'>('National');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV' | 'PPT'>('PDF');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [reportSuccessMsg, setReportSuccessMsg] = useState(false);

  // Interactive State 4: Municipality Comparative Checklist & Filters
  const [selectedMuniFilter, setSelectedMuniFilter] = useState<string>('All');
  const [muniDateRange, setMuniDateRange] = useState<'7d' | '30d' | 'ytd'>('30d');
  const [comparedMunis, setComparedMunis] = useState<string[]>(['Freetown City Council', 'Bo City Council', 'Makeni City Council']);

  // Interactive State 5: Real-Time Live Operations Wall Logging Engine
  const [liveLogs, setLiveLogs] = useState<LiveLog[]>([
    { id: 'L-101', timestamp: '12:24:15', type: 'incident', message: 'New waste pile logged at Aberdeen Rd Roundabout', source: 'Citizen App', severity: 'warning' },
    { id: 'L-102', timestamp: '12:22:08', type: 'dispatch', message: 'Compactor SL-104 dispatch instructions acknowledged', source: 'Fleet Node', severity: 'info' },
    { id: 'L-103', timestamp: '12:18:44', type: 'alert', message: 'Leachate filtration critical bypass threshold reached', source: 'Granville Brook IoT', severity: 'critical' },
    { id: 'L-104', timestamp: '12:15:30', type: 'muni', message: 'Bo City Council completed weekly drainage flushing program', source: 'BCC Supervisor', severity: 'info' },
    { id: 'L-105', timestamp: '12:10:12', type: 'incident', message: 'Secondary clog alarm registered in Kingtom drainage line', source: 'Sentinel Node C', severity: 'warning' }
  ]);

  // Interactive State 6: Hotspot Intervention Dispatch Trigger
  const [dispatchedHotspots, setDispatchedHotspots] = useState<Record<string, boolean>>({});

  // Trigger simulated live wall log addition every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const types: ('incident' | 'dispatch' | 'alert' | 'muni')[] = ['incident', 'dispatch', 'alert', 'muni'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const messages: Record<typeof randomType, string[]> = {
        incident: [
          'Unpermitted medical waste bin reported near Lumley market',
          'Heavy plastic accumulation clogging Aberdeen creek estuary',
          'Citizen report: Commercial market waste dump on Juba highway',
          'Organic waste dump overflow reported near Makeni plaza'
        ],
        dispatch: [
          'Skip Loader SL-209 en-route to Makeni secondary market',
          'Hauler SL-088 route re-optimized due to urban congestion',
          'Sanitation Crew Delta initialized coastal sweep near Kroo Bay',
          'Compactor SL-102 route cleared and entering landfill scale'
        ],
        alert: [
          'Rainfall sensor reports 42mm/hr - High clog warning',
          'Air quality sensor FCC-08 spiked: PM2.5 at 122 (Unhealthy)',
          'Ocean tide telemetry advises flood lock open in drainage Zone 1',
          'Water quality turbidity spiked in Waterloo drainage reservoir'
        ],
        muni: [
          'KCC approved extra Sunday afternoon dispatch lines',
          'FCC Environmental Officer requested 5 extra communal skips',
          'MCC initiated commercial waste pricing bracket adjustment',
          'Waterloo Rural District Council updated local compost targets'
        ]
      };

      const sourceMap: Record<typeof randomType, string> = {
        incident: 'Citizen Hub SL',
        dispatch: 'Fleet Smart Node',
        alert: 'EPA Air Monitoring Node',
        muni: 'Municipal Secretary'
      };

      const severityMap: Record<typeof randomType, 'info' | 'warning' | 'critical'> = {
        incident: 'warning',
        dispatch: 'info',
        alert: 'critical',
        muni: 'info'
      };

      const selectedMsgs = messages[randomType];
      const randomMsg = selectedMsgs[Math.floor(Math.random() * selectedMsgs.length)];
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newLog: LiveLog = {
        id: `L-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: timeStr,
        type: randomType,
        message: randomMsg,
        source: sourceMap[randomType],
        severity: severityMap[randomType]
      };

      setLiveLogs(prev => [newLog, ...prev.slice(0, 8)]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Save KPIs to LocalStorage when changed
  const saveKPIs = (updatedKPIs: KPI[]) => {
    setKpis(updatedKPIs);
    operationalStore.setItem('ecoclean_kpis', JSON.stringify(updatedKPIs));
  };

  const handleCreateKPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiTitle.trim()) return;

    const newKpi: KPI = {
      id: `KPI-${Math.floor(10 + Math.random() * 90)}`,
      title: newKpiTitle,
      metric: 'National Index Target',
      target: newKpiTarget,
      current: Math.round(newKpiTarget * 0.85),
      unit: newKpiUnit,
      category: newKpiCategory,
      status: 'On Track'
    };

    const updated = [...kpis, newKpi];
    saveKPIs(updated);
    setNewKpiTitle('');
  };

  const handleDeleteKPI = (id: string) => {
    const updated = kpis.filter(k => k.id !== id);
    saveKPIs(updated);
  };

  // Run reporting exporter simulation
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingReport(true);
    setGenerationStep(1);

    const steps = [
      'Synchronizing national environmental telemetry database...',
      'Aggregating trash accumulation ratios and GPS coordinates...',
      'Calculating municipal carbon offsets and plastic recovery metrics...',
      'Assembling high-fidelity briefing layouts and charts...',
      'Applying official EPA Secretariat digital seal...'
    ];

    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps.length) {
        setGenerationStep(currentStep);
      } else {
        clearInterval(interval);
        setIsGeneratingReport(false);
        setReportSuccessMsg(true);
        setTimeout(() => setReportSuccessMsg(false), 3000);
      }
    }, 900);
  };

  // Dispatch Hotspot trigger
  const handleDispatchHotspot = (id: string, name: string) => {
    setDispatchedHotspots(prev => ({ ...prev, [id]: true }));
    
    // Add active dispatch to real-time wall
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: LiveLog = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: timeStr,
      type: 'dispatch',
      message: `PRIORITY EMERGENCY DISPATCH: Crew redirected to ${name}`,
      source: 'Secretariat Intelligence',
      severity: 'critical'
    };
    setLiveLogs(prev => [newLog, ...prev]);
  };

  // Algorithmic computations based on Population, Commercial Activity, and Rainfall Sliders
  const calculatedPredictions = useMemo(() => {
    const baseWasteGrowthRate = populationGrowth * 1.2 + (commercialIndex - 1) * 8.5;
    const expectedTonnageGrowth = 2240 * (1 + baseWasteGrowthRate / 100);
    const rainFactor = rainfallAnomaly > 0 ? (rainfallAnomaly * 0.18) : 0;
    const drainageClogRisk = Math.min(Math.round(45 + baseWasteGrowthRate * 1.5 + rainFactor), 100);
    const responseSlaImpact = parseFloat((4.2 * (1 + (baseWasteGrowthRate * 0.05) + (rainFactor * 0.08))).toFixed(1));

    return {
      wasteGrowthRate: baseWasteGrowthRate.toFixed(1),
      tonnage: Math.round(expectedTonnageGrowth),
      clogRisk: drainageClogRisk,
      avgSlaHours: responseSlaImpact
    };
  }, [populationGrowth, commercialIndex, rainfallAnomaly]);

  // Static list of municipalities for comparative checklist
  const municipalList = [
    { name: 'Freetown City Council', district: 'Western Area Urban', efficiency: 88, satisfaction: 84, responseTime: 3.8, impact: 92 },
    { name: 'Waterloo Rural District Council', district: 'Western Area Rural', efficiency: 74, satisfaction: 68, responseTime: 5.6, impact: 78 },
    { name: 'Bo City Council', district: 'Southern Province', efficiency: 86, satisfaction: 80, responseTime: 4.1, impact: 85 },
    { name: 'Kenema City Council', district: 'Eastern Province', efficiency: 82, satisfaction: 75, responseTime: 4.5, impact: 80 },
    { name: 'Makeni City Council', district: 'Northern Province', efficiency: 84, satisfaction: 78, responseTime: 4.3, impact: 83 }
  ];

  const filteredMunis = useMemo(() => {
    return municipalList.filter(m => {
      if (selectedMuniFilter !== 'All' && m.district !== selectedMuniFilter) return false;
      return true;
    });
  }, [selectedMuniFilter]);

  return (
    <div className="space-y-6 font-sans">
      {/* Platform Sub-Header and Route Selector */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600 animate-pulse" />
            <span>Environmental Intelligence & Analytics Suite</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Executive oversight, historical trend indexes, and predictive forecasting engines for sovereign authorities.
          </p>
        </div>

        {/* Floating Metrics Badge */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-mono font-bold text-gray-400">SYNC STATE: LIVE SECURE SEC_NODE_07</span>
        </div>
      </div>

      {/* Grid Menu of 12 Routes for State-Based Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-slate-100 p-2 rounded-2xl">
        {[
          { id: 'national', label: 'National Overview', icon: BarChart3 },
          { id: 'municipalities', label: 'Municipalities', icon: ArrowLeftRight },
          { id: 'districts', label: 'District Trends', icon: MapPin },
          { id: 'environment', label: 'Environ. Intel', icon: ShieldAlert },
          { id: 'performance', label: 'Scorecards', icon: Award },
          { id: 'predictions', label: 'Predictive AI', icon: TrendingUp },
          { id: 'hotspots', label: 'Hotspot Map', icon: Map },
          { id: 'reports', label: 'Executive Reports', icon: FileText },
          { id: 'leaderboards', label: 'Leaderboard', icon: ListOrdered },
          { id: 'kpis', label: 'KPI Manager', icon: Target },
          { id: 'live', label: 'Live Wall', icon: Activity },
          { id: 'ai-ready', label: 'AI Architecture', icon: Sparkles }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-emerald-400 shadow-md transform -translate-y-0.5' 
                  : 'bg-white hover:bg-slate-50 text-gray-600 border border-transparent hover:border-slate-200'
              }`}
            >
              <TabIcon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-bold tracking-tight leading-tight block">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Frame */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm min-h-[450px]"
        >
          {/* ====================================================
              1. NATIONAL ANALYTICS DASHBOARD
              ==================================================== */}
          {activeSubTab === 'national' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">National Waste Analytics Index</h3>
                  <p className="text-xs text-gray-500">Quarterly macro overview of case progression, triage speed, and citizen ratios.</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border">SL-NAT-INDEX</span>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Total Reports', value: '1,420', trend: '+12% MoM', desc: 'Combined nationwide logs', color: 'text-slate-900' },
                  { label: 'Active Cases', value: '210', trend: '-8% Week', desc: 'Currently in triage/routing', color: 'text-amber-600' },
                  { label: 'Completed Cases', value: '1,210', trend: '85.2% Rate', desc: 'Fully resolved and validated', color: 'text-emerald-600' },
                  { label: 'Avg Resolution Time', value: '4.2 Hrs', trend: 'SLA Compliant', desc: 'Avg triage to close-out', color: 'text-indigo-600' },
                  { label: 'Citizen Participation', value: '74.8%', trend: '+4.5% MoM', desc: 'Citizen active reporters', color: 'text-teal-600' },
                  { label: 'Environ. Health Score', value: '88/100', trend: 'Excellent', desc: 'Overall index parameters', color: 'text-emerald-500 font-bold' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">{stat.label}</span>
                      <span className={`text-2xl font-black block mt-2 ${stat.color}`}>{stat.value}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-mono text-emerald-600 font-extrabold block">{stat.trend}</span>
                      <p className="text-[8px] text-gray-400 leading-tight block mt-0.5">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SVG Area Chart: Waste Progression Trend */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">Waste Accumulation Trend (Last 7 Months)</h4>
                    <span className="text-[9px] font-mono font-bold text-gray-400">Unit: Metric Tons (t)</span>
                  </div>
                  
                  {/* Custom SVG Line Area Graph */}
                  <div className="relative h-48 w-full">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid guidelines */}
                      <line x1="0" y1="20" x2="400" y2="20" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="400" y2="60" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="130" x2="400" y2="130" stroke="#cbd5e1" strokeWidth="1" />

                      {/* Line Area Path */}
                      <path 
                        d="M 10,130 L 10,120 L 70,110 L 130,85 L 190,95 L 250,55 L 310,40 L 370,25 L 370,130 Z" 
                        fill="url(#areaGrad)" 
                      />
                      {/* Active Reports Line */}
                      <path 
                        d="M 10,120 L 70,110 L 130,85 L 190,95 L 250,55 L 310,40 L 370,25" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                      {/* Resolved Reports Line */}
                      <path 
                        d="M 10,125 L 70,118 L 130,105 L 190,115 L 250,75 L 310,50 L 370,42" 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="2.5" 
                        strokeDasharray="4 2"
                      />

                      {/* Nodes */}
                      <circle cx="70" cy="110" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="130" cy="85" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="250" cy="55" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="310" cy="40" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="370" cy="25" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

                      {/* X Axis Labels */}
                      <text x="10" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Jan</text>
                      <text x="70" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Feb</text>
                      <text x="130" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Mar</text>
                      <text x="190" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Apr</text>
                      <text x="250" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">May</text>
                      <text x="310" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Jun</text>
                      <text x="370" y="145" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Jul</text>
                    </svg>
                  </div>

                  <div className="flex justify-center gap-6 mt-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-emerald-500 rounded" /> Monthly Logs</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-indigo-500 rounded border border-dashed border-indigo-400" /> Resolved On-Time</span>
                  </div>
                </div>

                {/* SVG Bar/Pie Combo: Category & Muni Breakdowns */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">Volume Distribution by Category</h4>
                      <span className="text-[9px] font-mono text-emerald-600 font-extrabold">MoM Baseline: Stable</span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { label: 'Illegal Dumping Outflow', value: 41, color: 'bg-red-500' },
                        { label: 'Communal Bin Overflow', value: 28, color: 'bg-teal-500' },
                        { label: 'Blocked Drainage Silt', value: 19, color: 'bg-indigo-500' },
                        { label: 'Missed Weekly Collections', value: 8, color: 'bg-amber-500' },
                        { label: 'Hazardous Residues', value: 4, color: 'bg-purple-500' }
                      ].map((cat, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-600">
                            <span>{cat.label}</span>
                            <span className="font-mono text-gray-900">{cat.value}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                              style={{ width: `${cat.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              2. MUNICIPALITY ANALYTICS
              ==================================================== */}
          {activeSubTab === 'municipalities' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Regional Municipality rankings</h3>
                  <p className="text-xs text-gray-500">Cross-compare collection, citizen satisfaction, and environmental impact.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* District Filter Dropdown */}
                  <div className="flex items-center bg-gray-50 border rounded-xl px-2.5 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                    <select
                      value={selectedMuniFilter}
                      onChange={e => setSelectedMuniFilter(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-gray-700 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="All">All Provinces</option>
                      <option value="Western Area Urban">Western Area Urban</option>
                      <option value="Western Area Rural">Western Area Rural</option>
                      <option value="Southern Province">Southern Province</option>
                      <option value="Northern Province">Northern Province</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="flex bg-slate-100 p-0.5 rounded-xl border">
                    {(['7d', '30d', 'ytd'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setMuniDateRange(range)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          muniDateRange === range ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {range.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compare Municipality Checklist selectors */}
              <div className="bg-slate-50 border rounded-2xl p-4 space-y-2.5">
                <span className="text-[10px] font-bold text-gray-500 font-mono block uppercase">Interactive Comparison Set:</span>
                <div className="flex flex-wrap gap-4">
                  {municipalList.map((m) => (
                    <label key={m.name} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={comparedMunis.includes(m.name)}
                        onChange={() => {
                          if (comparedMunis.includes(m.name)) {
                            setComparedMunis(comparedMunis.filter(n => n !== m.name));
                          } else {
                            setComparedMunis([...comparedMunis, m.name]);
                          }
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{m.name.split(' ')[0]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* rankings table */}
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold">
                      <th className="p-3.5 font-mono text-[10px] uppercase">Municipality Jurisdiction</th>
                      <th className="p-3.5 font-mono text-[10px] uppercase">Province/District</th>
                      <th className="p-3.5 font-mono text-[10px] uppercase">Collection Efficiency</th>
                      <th className="p-3.5 font-mono text-[10px] uppercase">SLA Resolution</th>
                      <th className="p-3.5 font-mono text-[10px] uppercase">Civic Rating</th>
                      <th className="p-3.5 font-mono text-[10px] uppercase">Environmental Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMunis.map((muni, index) => {
                      const isCompared = comparedMunis.includes(muni.name);
                      return (
                        <tr 
                          key={muni.name} 
                          className={`hover:bg-slate-50/60 transition-colors ${
                            isCompared ? 'bg-emerald-50/20 font-semibold' : ''
                          }`}
                        >
                          <td className="p-3.5 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                              #{index + 1}
                            </span>
                            <span className="text-gray-900 font-bold">{muni.name}</span>
                          </td>
                          <td className="p-3.5 text-gray-500 font-mono">{muni.district}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">{muni.efficiency}%</span>
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500" style={{ width: `${muni.efficiency}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                              {muni.responseTime} hrs avg
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-yellow-600 font-bold font-mono">★ {muni.satisfaction / 20} / 5</span>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                              {muni.impact} AQI/SHI
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* comparative card section */}
              {comparedMunis.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {municipalList.filter(m => comparedMunis.includes(m.name)).map((m) => (
                    <div key={m.name} className="bg-slate-900 text-white border border-slate-950 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                      <div>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">COMPARATIVE ANALYSIS UNIT</span>
                        <h4 className="text-sm font-black text-white mt-1">{m.name}</h4>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Collection Efficiency:</span>
                          <span className="font-bold text-white">{m.efficiency}%</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>SLA Target Limit:</span>
                          <span className="font-bold text-white">4.0 Hours</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Soil Leaching index:</span>
                          <span className="font-bold text-emerald-400">{m.impact} SHI</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              3. DISTRICT ANALYTICS
              ==================================================== */}
          {activeSubTab === 'districts' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">District Waste Volume & Response trends</h3>
                <p className="text-xs text-gray-500">Provincial and district metrics detailing recycling coverage, dispatch response speed, and priority clogs.</p>
              </div>

              {/* District cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Western Area Urban', population: '1.2M', growth: '+15.2%', rating: 'High Risk', alert: 'Active Drainage Clogs' },
                  { name: 'Southern Province (Bo)', population: '800K', growth: '+8.4%', rating: 'Stable', alert: 'Landfill expansion' },
                  { name: 'Northern Province (Bombali)', population: '950K', growth: '+11.1%', rating: 'Moderate Risk', alert: 'Illegal Market Pile' },
                  { name: 'Eastern Province (Kenema)', population: '720K', growth: '+6.5%', rating: 'Stable', alert: 'Recycle pilot online' }
                ].map((dist) => (
                  <div key={dist.name} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black text-gray-900">{dist.name}</h4>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          dist.rating === 'High Risk' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'
                        }`}>{dist.rating}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">Sovereign Census: {dist.population}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                        <span>Volume growth:</span>
                        <span className="font-extrabold text-gray-900">{dist.growth} MoM</span>
                      </div>
                      <div className="text-[9px] text-indigo-600 font-bold uppercase tracking-wide flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{dist.alert}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tonnage comparative graph */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">Waste Volume Trend Comparison (Tons / Month)</h4>
                  <span className="text-[10px] font-mono text-gray-400">District Base: FCC, BCC, MCC</span>
                </div>

                <div className="relative h-44 w-full">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Freetown Line (Green) */}
                    <path d="M 10,100 Q 120,60 250,50 T 480,20" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                    {/* Bo Line (Yellow) */}
                    <path d="M 10,110 Q 120,95 250,75 T 480,45" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Makeni Line (Indigo) */}
                    <path d="M 10,115 Q 120,110 250,90 T 480,60" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />

                    {/* Nodes */}
                    <circle cx="250" cy="50" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="250" cy="75" r="4.5" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="250" cy="90" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Text values */}
                    <text x="250" y="38" className="fill-emerald-700 font-mono text-[9px] font-bold" textAnchor="middle">840 Tons</text>

                    {/* Months */}
                    <text x="10" y="135" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Q1 Baseline</text>
                    <text x="250" y="135" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Q2 Active Phase</text>
                    <text x="480" y="135" className="fill-gray-400 font-mono text-[8px]" textAnchor="middle">Q3 Forecast</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              4. ENVIRONMENTAL INTELLIGENCE CENTER
              ==================================================== */}
          {activeSubTab === 'environment' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">Hydrological Risk & Drainage Blockage Indicators</h3>
                <p className="text-xs text-gray-500">Early warning telemetry detailing chemical runoff risk, drainage debris saturation, and coastal erosion.</p>
              </div>

              {/* Warning Index Gauges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Atmospheric PM2.5', current: country.stats.airQualityIndex, target: 'Max 50 PM', desc: 'Acceptable range for respiratory safety', score: country.stats.airQualityIndex > 60 ? 'Unhealthy' : 'Moderate', color: 'bg-red-500' },
                  { name: 'Water Purity Index', current: country.stats.waterQualityIndex, target: 'Min 80 WQI', desc: 'Leachate filtration at Granville Brook', score: country.stats.waterQualityIndex > 70 ? 'Excellent' : 'Critical', color: 'bg-teal-500' },
                  { name: 'Terrestrial SHI', current: country.stats.soilHealthIndex, target: 'Min 75 SHI', desc: 'Toxic compost buffer proximity logs', score: 'Stable', color: 'bg-emerald-500' }
                ].map((gauge, idx) => (
                  <div key={idx} className="border border-gray-100 bg-slate-50/40 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-gray-900">{gauge.name}</span>
                      <span className="font-mono text-gray-400 text-[10px]">{gauge.target}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-gray-950">{gauge.current}</span>
                      <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-100 uppercase text-indigo-600">
                        {gauge.score}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-relaxed font-mono">{gauge.desc}</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${gauge.color}`} style={{ width: `${gauge.current}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Environmental Hotspot warning block */}
              <div className="bg-red-50 border border-red-150 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-red-800 uppercase tracking-wider font-mono">CRITICAL EARLY RISK NOTICE: ESTUARINE SILTING</h4>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Heavy plastic debris blockages have saturated Freetown’s Kroo Bay Drainage channel by **82.4%** ahead of the heavy rainfall season. Rapid sanitation deployment is recommended to prevent localized coastal mud-clogging.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              5. PERFORMANCE SCORECARDS
              ==================================================== */}
          {activeSubTab === 'performance' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">National & Operational performance Scorecards</h3>
                <p className="text-xs text-gray-500">Annual target vs actual evaluations across citizen, staff, municipal, and national branches.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Citizen Engagement Score', rating: '92/100', target: 'Target: 85', stats: 'Based on reporting accuracy & Reward Store redemption rates.', color: 'from-emerald-500 to-teal-500' },
                  { title: 'Staff Performance Index', rating: '84/100', target: 'Target: 80', stats: 'Average task resolution time & photo verification compliance.', color: 'from-blue-500 to-indigo-500' },
                  { title: 'Supervisor Dispatch SLA', rating: '89/100', target: 'Target: 85', stats: 'Average time between incident intake and sanitation dispatch.', color: 'from-purple-500 to-indigo-600' },
                  { title: 'Municipality Performance average', rating: '78/100', target: 'Target: 80 (Critical)', stats: 'Aggregated regional landfill control and bin emptying compliance.', color: 'from-orange-500 to-red-500' }
                ].map((score, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all bg-slate-50/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{score.title}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">{score.target}</p>
                      </div>
                      <span className="text-3xl font-black text-slate-900">{score.rating}</span>
                    </div>

                    <p className="text-xs text-gray-600 mt-4 leading-relaxed font-mono bg-white p-3 rounded-xl border border-gray-100">
                      {score.stats}
                    </p>

                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
                      <div className={`h-full bg-linear-to-r ${score.color}`} style={{ width: score.rating.split('/')[0] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              6. PREDICTIVE ANALYTICS
              ==================================================== */}
          {activeSubTab === 'predictions' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">AI-Powered Waste Growth & Demand Simulator</h3>
                  <p className="text-xs text-gray-500">Tweak environmental coefficients to observe projected clogs and collection needs.</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Predictive Engine Enabled
                </span>
              </div>

              {/* Scenarios Interactive Slider controls */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 font-mono">
                    <span>Population Growth Rate</span>
                    <span className="text-emerald-600">{populationGrowth}% Annually</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={populationGrowth}
                    onChange={e => setPopulationGrowth(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[9px] text-gray-400 leading-tight block">Toggles sewage and organic heap density.</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 font-mono">
                    <span>Commercial Activity scaling</span>
                    <span className="text-indigo-600">{commercialIndex}x Factor</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.5"
                    step="0.05"
                    value={commercialIndex}
                    onChange={e => setCommercialIndex(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-[9px] text-gray-400 leading-tight block">Increases plastics and packaging waste indices.</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 font-mono">
                    <span>Rainfall seasonal anomaly</span>
                    <span className="text-blue-600">+{rainfallAnomaly}% Anomaly</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="60"
                    step="2"
                    value={rainfallAnomaly}
                    onChange={e => setRainfallAnomaly(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[9px] text-gray-400 leading-tight block">Drives drainage caking, silting, and flooding risk.</span>
                </div>
              </div>

              {/* Simulation Output Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-2xl p-4 text-center bg-white space-y-1">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Calculated Waste growth</span>
                  <span className="text-3xl font-black text-gray-900 block">{calculatedPredictions.wasteGrowthRate}%</span>
                  <p className="text-[9px] text-gray-500 mt-1 block">Expected organic & plastic volume acceleration.</p>
                </div>

                <div className="border rounded-2xl p-4 text-center bg-white space-y-1">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Weekly collection Demand</span>
                  <span className="text-3xl font-black text-emerald-600 block">{calculatedPredictions.tonnage} Tons</span>
                  <p className="text-[9px] text-gray-500 mt-1 block">Logistical requirements on active compactors.</p>
                </div>

                <div className="border rounded-2xl p-4 text-center bg-white space-y-1">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Estuary Drainage Clog Risk</span>
                  <span className={`text-3xl font-black block ${
                    calculatedPredictions.clogRisk > 75 ? 'text-red-600' : 'text-amber-500'
                  }`}>{calculatedPredictions.clogRisk}%</span>
                  <p className="text-[9px] text-gray-500 mt-1 block">Based on drainage silting model calculations.</p>
                </div>

                <div className="border rounded-2xl p-4 text-center bg-white space-y-1">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Predicted Avg response SLA</span>
                  <span className="text-3xl font-black text-indigo-600 block">{calculatedPredictions.avgSlaHours} Hours</span>
                  <p className="text-[9px] text-gray-500 mt-1 block">Expected triage resolution dispatch delay.</p>
                </div>
              </div>

              {/* Resource capacity suggestion warning banner */}
              <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-indigo-800 uppercase tracking-wider font-mono">SUGGESTED RESOURCE EXPANSION ADVICE</h4>
                  <p className="text-xs text-indigo-700 leading-normal mt-1">
                    Based on a simulated population scaling of {populationGrowth}% combined with rain anomalies, we predict that **Waterloo District (WRDC)** and **Freetown (FCC) Ward 302** will face a trash heap volume excess of **+{Math.round((calculatedPredictions.tonnage - 2240) / 10)} tons** within 45 days. The AI engine recommends assigning **+2 skip containers** immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              7. HOTSPOT DETECTION
              ==================================================== */}
          {activeSubTab === 'hotspots' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">Interactive Hotspot Grid Map</h3>
                <p className="text-xs text-gray-500">Detect and manage illegal dumping hotspots and recurring blockage locations directly on the GIS grid.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Visual Map Grid */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-950 rounded-2xl overflow-hidden p-4 relative min-h-[300px] flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 backdrop-blur-md px-2.5 py-1 text-[9px] text-slate-400 font-mono rounded">
                    HOTSPOT RESOLUTION SCANNER
                  </div>

                  {/* SVG Map Shape Representation with Plot Points */}
                  <svg viewBox="0 0 400 300" className="w-full max-w-[400px] h-auto select-none">
                    {/* Outline */}
                    <path d="M 40,210 Q 120,40 280,30 T 380,240 Q 280,280 140,260 Z" fill="rgba(30, 41, 59, 0.4)" stroke="#334155" strokeWidth="1.5" />
                    
                    {/* Plot Points for Hotspots */}
                    {[
                      { id: 'HS-01', name: 'Aberdeen Waste Pile', x: 80, y: 150, severity: 'High', color: 'fill-red-500' },
                      { id: 'HS-02', name: 'Kroo Bay Estuary', x: 130, y: 190, severity: 'Critical', color: 'fill-red-600 animate-ping' },
                      { id: 'HS-03', name: 'Makeni Plaza Clog', x: 260, y: 90, severity: 'Medium', color: 'fill-amber-500' },
                      { id: 'HS-04', name: 'Bo Town Scrap Pile', x: 210, y: 220, severity: 'Critical', color: 'fill-red-600 animate-ping' }
                    ].map(pt => (
                      <g key={pt.id}>
                        {/* Ping Circle */}
                        <circle cx={pt.x} cy={pt.y} r="8" className="stroke-red-400/20 fill-red-400/10 animate-pulse" />
                        {/* Core Circle */}
                        <circle cx={pt.x} cy={pt.y} r="4.5" className={pt.color} />
                        {/* Core Target Anchor for Dispatch click */}
                        <text x={pt.x} y={pt.y - 8} className="fill-slate-300 font-mono text-[7.5px] font-bold" textAnchor="middle">{pt.name}</text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Priority Intervention Dispatch list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wider block">Priority Interventions</span>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {[
                      { id: 'HS-01', name: 'Aberdeen Rd Waste Pile', intensity: 'High', volume: '4.2 Tons', category: 'Illegal Dump' },
                      { id: 'HS-02', name: 'Kroo Bay Estuary Block', intensity: 'Critical', volume: '12.8 Tons', category: 'Blocked Drainage' },
                      { id: 'HS-03', name: 'Makeni Market Clog', intensity: 'Medium', volume: '2.1 Tons', category: 'Organic Pile' },
                      { id: 'HS-04', name: 'Bo Highway Scrap Heap', intensity: 'Critical', volume: '9.4 Tons', category: 'Toxic Scrap' }
                    ].map(hs => {
                      const isDispatched = dispatchedHotspots[hs.id];
                      return (
                        <div key={hs.id} className="border border-gray-100 bg-slate-50 p-3 rounded-xl flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-black text-gray-900">{hs.name}</h4>
                              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                hs.intensity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>{hs.intensity}</span>
                            </div>
                            <p className="text-[9px] text-gray-400 font-mono">Volume: {hs.volume} • {hs.category}</p>
                          </div>

                          <button
                            onClick={() => handleDispatchHotspot(hs.id, hs.name)}
                            disabled={isDispatched}
                            className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                              isDispatched 
                                ? 'bg-slate-200 text-gray-400 border-none' 
                                : 'bg-red-500 text-white hover:bg-red-600 shadow-xs'
                            }`}
                          >
                            {isDispatched ? <CheckCircle className="w-3 h-3" /> : <Play className="w-3 h-3 animate-pulse" />}
                            <span>{isDispatched ? 'Dispatched' : 'Dispatch'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              8. EXECUTIVE REPORTING CENTER
              ==================================================== */}
          {activeSubTab === 'reports' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">Executive Briefing & Report Exporter</h3>
                <p className="text-xs text-gray-500">Formulate and export certified environmental audit logs, municipality rankings, and Carbon/Ozone status.</p>
              </div>

              <div className="max-w-xl mx-auto bg-slate-50 border border-slate-150 rounded-3xl p-6 shadow-sm">
                <div className="text-center mb-6 space-y-1.5">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-100 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider font-mono">Secretariat Analytical brief Generator</h4>
                  <p className="text-xs text-gray-500">Outputs EPA-certified environmental metrics in multiple formats.</p>
                </div>

                <form onSubmit={handleGenerateReport} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Period selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 font-mono uppercase">Reporting Period</label>
                      <select
                        value={reportPeriod}
                        onChange={e => setReportPeriod(e.target.value as any)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
                      >
                        <option value="Daily">Daily Reports</option>
                        <option value="Weekly">Weekly Summary Reports</option>
                        <option value="Monthly">Monthly Analytics Brief</option>
                        <option value="Quarterly">Quarterly Executive Report</option>
                        <option value="Annual">Annual Sustainability Report</option>
                      </select>
                    </div>

                    {/* Scope selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 font-mono uppercase">Jurisdiction Scope</label>
                      <select
                        value={reportScope}
                        onChange={e => setReportScope(e.target.value as any)}
                        className="w-full bg-white border rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
                      >
                        <option value="National">National (Sierra Leone)</option>
                        <option value="Freetown">Freetown City Council</option>
                        <option value="Bo">Bo City Council</option>
                        <option value="Kenema">Kenema City Council</option>
                        <option value="Makeni">Makeni City Council</option>
                      </select>
                    </div>
                  </div>

                  {/* Format selector buttons */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 font-mono uppercase block mb-1">Export Formats</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['PDF', 'Excel', 'CSV', 'PPT'] as const).map(fmt => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setReportFormat(fmt)}
                          className={`py-2 px-1 text-xs font-bold font-mono rounded-xl border text-center transition-all cursor-pointer ${
                            reportFormat === fmt 
                              ? 'bg-slate-900 text-emerald-400 border-slate-950 shadow-xs' 
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button & Loader */}
                  <div className="pt-3">
                    {isGeneratingReport ? (
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-700">
                          <span>Progress: {generationStep * 20}%</span>
                          <span className="animate-pulse">Building Brief...</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${generationStep * 20}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-gray-500 text-center font-mono leading-relaxed">
                          {[
                            '',
                            'Syncing National environmental telemetry...',
                            'Extracting waste coordinates and volume factors...',
                            'Compiling carbon mitigation ratios...',
                            'Formatting brief presentation layouts...',
                            'Applying official digital signature...'
                          ][generationStep]}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Certified {reportPeriod} Executive Summary ({reportFormat})</span>
                      </button>
                    )}
                  </div>
                </form>

                {reportSuccessMsg && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold justify-center">
                    <CheckCircle className="w-4 h-4" />
                    <span>Report downloaded successfully in ({reportFormat}) format.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              9. NATIONAL LEADERBOARD
              ==================================================== */}
          {activeSubTab === 'leaderboards' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">Sovereign Leaderboards & Recognition</h3>
                <p className="text-xs text-gray-500">Weekly rankings detailing outstanding municipalities, active field crews, and civic contribution points.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Municipal Rank card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">Top Municipalities</h4>
                    <span className="text-[10px] font-mono text-emerald-600 font-extrabold">Active</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Freetown City Council', rate: '88% Efficiency', points: '★ 4.8 Rating' },
                      { name: 'Bo City Council', rate: '86% Efficiency', points: '★ 4.4 Rating' },
                      { name: 'Makeni City Council', rate: '84% Efficiency', points: '★ 4.2 Rating' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-gray-800">{item.name.split(' ')[0]}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="font-mono text-[9px] font-bold text-gray-900">{item.rate}</p>
                          <p className="text-[8px] text-gray-400 font-mono">{item.points}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Crews card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">Outstanding Field Crews</h4>
                    <span className="text-[10px] font-mono text-indigo-600 font-extrabold">Dispatch SLA</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Crew Delta (Freetown)', rate: '142 resolved', compliance: '98% on-time' },
                      { name: 'MCC Crew Alpha (Makeni)', rate: '110 resolved', compliance: '94% on-time' },
                      { name: 'BCC Highway Team (Bo)', rate: '96 resolved', compliance: '92% on-time' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-gray-800">{item.name}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="font-mono text-[9px] font-bold text-gray-900">{item.rate}</p>
                          <p className="text-[8px] text-gray-400 font-mono">{item.compliance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outstanding Citizens card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">Most Active Citizens</h4>
                    <span className="text-[10px] font-mono text-teal-600 font-extrabold">Reward Points</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Fatmata Sesay', rate: '42 Reports Logged', compliance: '940 Green Points' },
                      { name: 'Alimamy Koroma', rate: '36 Reports Logged', compliance: '810 Green Points' },
                      { name: 'Mariama Turay', rate: '29 Reports Logged', compliance: '620 Green Points' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-500 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-gray-800">{item.name}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="font-mono text-[9px] font-bold text-gray-900">{item.rate}</p>
                          <p className="text-[8px] text-gray-400 font-mono">{item.compliance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              10. KPI MANAGEMENT
              ==================================================== */}
          {activeSubTab === 'kpis' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">National Key Performance Indicators (KPIs)</h3>
                <p className="text-xs text-gray-500">Configure and track operational sustainability targets across multiple sovereign dimensions.</p>
              </div>

              {/* KPI Tracker Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="border border-gray-100 bg-slate-50/50 p-4 rounded-2xl flex flex-col justify-between hover:shadow-xs transition-all relative">
                    <button 
                      onClick={() => handleDeleteKPI(kpi.id)}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                      title="Delete KPI"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-extrabold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                          {kpi.id}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{kpi.category}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-gray-900">{kpi.title}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[9px] text-gray-400 font-mono uppercase block">Sovereign Target</span>
                        <span className="text-base font-black text-gray-800">{kpi.target} {kpi.unit}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-mono uppercase block">Current Value</span>
                        <span className={`text-base font-black ${
                          kpi.status === 'Critical' ? 'text-red-600' : kpi.status === 'At Risk' ? 'text-amber-500' : 'text-emerald-600'
                        }`}>{kpi.current} {kpi.unit}</span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full ${
                          kpi.status === 'Critical' ? 'bg-red-500' : kpi.status === 'At Risk' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Create KPI Form */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 mt-6">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Create Sovereign KPI Target Parameter</span>
                </h4>

                <form onSubmit={handleCreateKPI} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 font-mono uppercase">KPI Indicator Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Waterloo Skip Recycling"
                      value={newKpiTitle}
                      onChange={e => setNewKpiTitle(e.target.value)}
                      className="w-full bg-white border rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 font-mono uppercase">Category</label>
                    <select
                      value={newKpiCategory}
                      onChange={e => setNewKpiCategory(e.target.value)}
                      className="w-full bg-white border rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Operational">Operational</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Citizen Service">Citizen Service</option>
                      <option value="Risk Management">Risk Management</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 font-mono uppercase">Target Value ({newKpiUnit})</label>
                    <input
                      type="number"
                      value={newKpiTarget}
                      onChange={e => setNewKpiTarget(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Register KPI Node
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ====================================================
              11. REAL-TIME OPERATIONS WALL
              ==================================================== */}
          {activeSubTab === 'live' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">National Real-Time Operations Wall</h3>
                  <p className="text-xs text-gray-500">Continuous live stream of sensor reports, dispatches, alerts, and supervisor acknowledgements.</p>
                </div>
                <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Live Stream active
                </span>
              </div>

              {/* Real-time wall grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Scrollable ticker feed */}
                <div className="lg:col-span-3 space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {liveLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`border p-4 rounded-2xl flex items-start justify-between gap-4 transition-all hover:bg-slate-50/55 ${
                        log.severity === 'critical' ? 'bg-red-50/40 border-red-100' : 'bg-slate-50/40 border-gray-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-extrabold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                            {log.timestamp}
                          </span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                            log.type === 'alert' ? 'bg-red-100 text-red-700' : log.type === 'dispatch' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">Source: {log.source}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-800 leading-normal">{log.message}</p>
                      </div>

                      <span className="text-[10px] font-mono text-gray-400 uppercase shrink-0">{log.id}</span>
                    </div>
                  ))}
                </div>

                {/* Wall telemetry sidebar */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-950 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Active Streams</h4>
                    
                    <div className="space-y-3 text-xs font-mono text-slate-400">
                      <div className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span>IoT Hydrological Nodes:</span>
                        <span className="text-white font-bold">14 Online</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span>Staff GPS Telemetry:</span>
                        <span className="text-white font-bold">45 Active</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span>Fleet Dispatch Loops:</span>
                        <span className="text-white font-bold">6 Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Citizen Hub Listeners:</span>
                        <span className="text-white font-bold">88 online</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 font-mono mt-6 leading-tight">
                    All operations stream securely over SSL. Local municipal data clusters synchronize every 10 seconds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              12. AI-READY INSIGHTS
              ==================================================== */}
          {activeSubTab === 'ai-ready' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-gray-900">Future-Proof AI Integration Architecture</h3>
                <p className="text-xs text-gray-500">Interface schemas, machine learning configurations, and anomaly logs pre-wired for future AI capabilities.</p>
              </div>

              {/* AI schema columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API model credentials */}
                <div className="border border-gray-150 bg-slate-50 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>ECOCLEAN Intelligence Services</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-normal">
                    Environmental telemetry is exposed through an ECOCLEAN-owned provider adapter. Optional future intelligence providers cannot control operational workflows or primary data:
                  </p>

                  <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-4 rounded-xl border overflow-x-auto leading-relaxed max-h-[180px]">
                    <pre>{`{
  "providerAdapter": "ecoclean-intelligence-v1",
  "endpoint": "/api/v1/predictions/waste",
  "inputs": {
    "district": "SL-DT-01 (Western Urban)",
    "weeklyTonnage": 840,
    "precipitationMm": 220,
    "growthRate": 2.4,
    "activeHotspotsCount": 12
  },
  "outputs": {
    "anomalyAlert": "boolean",
    "clogProbability": "float",
    "suggestedDispatches": "array"
  }
}`}</pre>
                  </div>
                </div>

                {/* ML capability blueprints */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-wider block">Blueprinted AI Modules</span>

                  {[
                    { name: 'Predictive Waste Accumulation', desc: 'Forecasts municipal waste excess ratios based on spatial density trends.' },
                    { name: 'Hydrological Flood Clog Risk', desc: 'Predicts high-vulnerability drainage blockages based on seasonal rainfall indices.' },
                    { name: 'Compactor Route Optimization', desc: 'Optimizes diesel consumption of sanitation dispatches based on real-time traffic.' },
                    { name: 'Civic Anomaly Detection', desc: 'Flags unpermitted commercial waste dumping logs using image verification models.' }
                  ].map((blue, idx) => (
                    <div key={idx} className="border border-gray-100 p-3.5 rounded-xl space-y-1 hover:border-emerald-600/30 transition-all">
                      <h5 className="text-xs font-black text-gray-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{blue.name}</span>
                      </h5>
                      <p className="text-[10.5px] text-gray-500 leading-relaxed font-mono">{blue.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

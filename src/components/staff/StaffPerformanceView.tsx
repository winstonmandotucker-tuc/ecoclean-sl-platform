import React from 'react';
import { 
  Star, Trophy, Clock, CheckCircle2, TrendingUp, Sparkles, Award, 
  Camera, Zap, Truck, AlertCircle 
} from 'lucide-react';
import { StaffPerformance } from '../../lib/staffData';

interface StaffPerformanceViewProps {
  performance: StaffPerformance;
}

export default function StaffPerformanceView({ performance }: StaffPerformanceViewProps) {
  
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5 text-teal-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      case 'Truck': return <Truck className="w-5 h-5 text-brand-primary" />;
      default: return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBadgeColor = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return 'bg-teal-50 border-teal-150';
      case 'Zap': return 'bg-amber-50 border-amber-150';
      case 'Truck': return 'bg-emerald-50 border-emerald-150';
      default: return 'bg-gray-50 border-gray-150';
    }
  };

  // Simple hardcoded max thresholds for SVG chart normalization
  const maxTasksVal = 50;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Operator Performance Scorecard</h2>
        <p className="text-xs text-gray-400 mt-1">Review verified completions, citizen feedback ratings, and national rank achievements.</p>
      </div>

      {/* Numerical Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">TOTAL RESOLUTIONS</span>
            <span className="text-2xl font-black text-gray-800 font-mono mt-1.5 block leading-none">{performance.completedTasks}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">AVG WORK SPEED</span>
            <span className="text-2xl font-black text-gray-800 font-mono mt-1.5 block leading-none">{performance.averageCompletionTime}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">CITIZEN STAR RATIO</span>
            <span className="text-2xl font-black text-gray-800 font-mono mt-1.5 block leading-none">{performance.citizenSatisfaction} / 5.0</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-2 bg-gradient-to-br from-white to-brand-primary/5">
          <div className="w-9 h-9 rounded-xl bg-brand-accent/20 text-brand-primary flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase leading-none">OFFICIAL RANK</span>
            <span className="text-sm font-extrabold text-brand-primary mt-2 block leading-tight">{performance.performanceRating}</span>
          </div>
        </div>

      </div>

      {/* Main Grid Content (SVG Trend Chart Left, Badges Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Monthly Trend Analytics Charts */}
        <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-brand-primary" />
              <h3 className="text-sm font-extrabold text-gray-850 uppercase tracking-wider font-mono">Monthly Resolution Trend</h3>
            </div>
            <span className="text-[10px] text-gray-450 font-mono">Normalized scale: July 2026 UTC</span>
          </div>

          {/* SVG custom styled vector line/bar graph */}
          <div className="py-6 flex-1 flex items-center justify-center min-h-[220px]">
            <svg viewBox="0 0 400 160" className="w-full max-w-lg aspect-[5/2]">
              {/* horizontal guide grid lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Y Axis labels */}
              <text x="30" y="24" textAnchor="end" className="fill-gray-400 text-[9px] font-mono">50t</text>
              <text x="30" y="64" textAnchor="end" className="fill-gray-400 text-[9px] font-mono">30t</text>
              <text x="30" y="104" textAnchor="end" className="fill-gray-400 text-[9px] font-mono">10t</text>
              <text x="30" y="144" textAnchor="end" className="fill-gray-450 text-[9px] font-mono font-bold">0</text>

              {/* Draw Vertical Columns/Bars representing monthly task counts */}
              {/* April: 32 tasks (140 - (32/50)*120 = 63.2) */}
              <rect x="75" y="63" width="16" height="77" rx="4" className="fill-emerald-100/60 stroke-emerald-200" strokeWidth="0.5" />
              <text x="83" y="55" textAnchor="middle" className="fill-emerald-800 text-[9px] font-mono font-bold">32</text>
              
              {/* May: 38 tasks (140 - (38/50)*120 = 48.8) */}
              <rect x="155" y="49" width="16" height="91" rx="4" className="fill-emerald-100/60 stroke-emerald-200" strokeWidth="0.5" />
              <text x="163" y="41" textAnchor="middle" className="fill-emerald-800 text-[9px] font-mono font-bold">38</text>

              {/* June: 45 tasks (140 - (45/50)*120 = 32) */}
              <rect x="235" y="32" width="16" height="108" rx="4" className="fill-emerald-100/80 stroke-emerald-300" strokeWidth="0.5" />
              <text x="243" y="24" textAnchor="middle" className="fill-emerald-800 text-[9px] font-mono font-bold">45</text>

              {/* July: 42 tasks (140 - (42/50)*120 = 39.2) */}
              <rect x="315" y="39" width="16" height="101" rx="4" className="fill-brand-primary stroke-emerald-700" strokeWidth="0.5" />
              <text x="323" y="31" textAnchor="middle" className="fill-brand-primary text-[9px] font-mono font-black">42</text>

              {/* X Axis Months Label */}
              <text x="83" y="154" textAnchor="middle" className="fill-gray-500 text-[10px] font-bold">April</text>
              <text x="163" y="154" textAnchor="middle" className="fill-gray-500 text-[10px] font-bold">May</text>
              <text x="243" y="154" textAnchor="middle" className="fill-gray-500 text-[10px] font-bold">June</text>
              <text x="323" y="154" textAnchor="middle" className="fill-brand-primary text-[10px] font-black">July</text>
            </svg>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-500 flex items-start gap-2 border">
            <AlertCircle className="w-4.5 h-4.5 text-brand-primary shrink-0" />
            <p className="leading-relaxed">
              <strong>Consistency Index:</strong> Your resolution speed improved by <strong>14%</strong> since April, keeping citizen satisfaction ratings above the <strong>4.8 FCC</strong> threshold.
            </p>
          </div>
        </div>

        {/* Earned Achievements list */}
        <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1.5 pb-3 border-b border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider font-mono">My Achievements</h3>
            <p className="text-xs text-gray-400">Medals unlocked via verified operations logs.</p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[250px] pr-1.5">
            {performance.achievements.map((ach) => (
              <div key={ach.id} className="flex gap-3 items-start text-xs">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getBadgeColor(ach.icon)}`}>
                  {getBadgeIcon(ach.icon)}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-extrabold text-gray-800 truncate leading-snug">{ach.name}</h4>
                    <span className="text-[9px] font-mono text-gray-400">{ach.dateEarned}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-brand-accent/20 border border-brand-accent/30 rounded-2xl p-4 text-center text-xs text-emerald-950 space-y-1">
            <span className="font-bold text-brand-primary">Next Unlocks: "Civic Clean Shield"</span>
            <p className="text-[11px] text-gray-500">Requires 3 more completions in Western Area Rural.</p>
          </div>
        </div>

      </div>

    </div>
  );
}

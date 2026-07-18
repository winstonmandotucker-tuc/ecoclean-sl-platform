import React from 'react';
import { 
  ShieldAlert, ShieldCheck, Clock, AlertTriangle, Play,
  TrendingUp, BarChart2, CheckCircle, Flame, Info
} from 'lucide-react';
import { StaffTask } from '../../lib/staffData';

interface SLAMonitoringProps {
  tasks: StaffTask[];
  onExpediteTask: (taskId: string) => void;
}

export default function SLAMonitoring({ tasks, onExpediteTask }: SLAMonitoringProps) {
  
  // Calculate SLA metrics dynamically based on current tasks
  const activeTasks = tasks.filter(t => t.status !== 'Completed');
  const highPriorityActive = activeTasks.filter(t => t.priority === 'High');
  
  // Simulated SLA calculations
  const avgResponseTime = "2.4 hours";
  const complianceRate = 92.4;

  // Let's create mock SLA tracking entries for active tasks
  const slaEntries = activeTasks.map((task, idx) => {
    // High priority: 4h (240m), Medium: 12h (720m), Low: 24h (1440m)
    const limitMinutes = task.priority === 'High' ? 240 : task.priority === 'Medium' ? 720 : 1440;
    
    // Simulate elapsed minutes based on index to create realistic variety
    const elapsedMinutes = idx === 0 ? 195 : idx === 1 ? 80 : 320;
    const remainingMinutes = Math.max(0, limitMinutes - elapsedMinutes);
    
    let status: 'Safe' | 'Warning' | 'Breached' = 'Safe';
    if (elapsedMinutes >= limitMinutes) {
      status = 'Breached';
    } else if (remainingMinutes <= 60) {
      status = 'Warning';
    }

    return {
      task,
      limitMinutes,
      elapsedMinutes,
      remainingMinutes,
      status
    };
  });

  const breachCount = slaEntries.filter(e => e.status === 'Breached').length;
  const warningCount = slaEntries.filter(e => e.status === 'Warning').length;

  const getSLAStatusBadge = (status: 'Safe' | 'Warning' | 'Breached') => {
    switch (status) {
      case 'Safe':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Warning':
        return 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse';
      case 'Breached':
        return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="sla-monitoring-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">SLA Monitoring Center</h2>
          <p className="text-xs text-gray-500 mt-0.5">Audit Service Level Agreements, inspect response times, and prevent municipal breach alarms</p>
        </div>
      </div>

      {/* SLA Target Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wider font-mono">🚨 High Priority Target</span>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold font-mono text-[10px] rounded border border-red-100">FCC-04</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-red-600 leading-none">4 Hours</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Max allowance to clear drainage blocks, chemical hazard spillages or high-congestion market spills.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wider font-mono">🟡 Medium Priority Target</span>
            <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 font-bold font-mono text-[10px] rounded border border-yellow-100">FCC-12</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-yellow-600 leading-none">12 Hours</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Max allowance to collect overflowing municipal skip bins and clear secondary highway illegal dumps.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wider font-mono">⚪ Low Priority Target</span>
            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 font-bold font-mono text-[10px] rounded border border-gray-150">FCC-24</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-700 leading-none">24 Hours</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Max allowance to complete coastal sand sweepings, volunteer campaign collection pickups or litter patrols.</p>
          </div>
        </div>
      </div>

      {/* SLA Live Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Overall Compliance</span>
          <div>
            <h4 className="text-2xl font-black text-emerald-600 leading-none">92.4%</h4>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Target Met (FCC &gt;90%)
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Average Resolution</span>
          <div>
            <h4 className="text-2xl font-black text-gray-800 leading-none">{avgResponseTime}</h4>
            <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Across all regional cells</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Breach Threats</span>
          <div>
            <h4 className={`text-2xl font-black leading-none ${warningCount > 0 ? 'text-amber-500 animate-pulse' : 'text-gray-800'}`}>
              {warningCount} dispatches
            </h4>
            <span className="text-[10px] text-amber-500 font-bold block mt-1.5">Expedited action required</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">SLA Breaches</span>
          <div>
            <h4 className={`text-2xl font-black leading-none ${breachCount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {breachCount} incidents
            </h4>
            <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Zero breaches target</span>
          </div>
        </div>

      </div>

      {/* SLA Tracking List */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider font-mono">Live SLA Countdown Monitors</h3>
          <p className="text-xs text-gray-500 mt-0.5">Direct real-time visual progress trackers for all active field dispatches</p>
        </div>

        <div className="space-y-4">
          {slaEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-medium">
              No active dispatches tracked in the SLA center. All cleared!
            </div>
          ) : (
            slaEntries.map((entry) => {
              const task = entry.task;
              const progressPercentage = Math.min(100, (entry.elapsedMinutes / entry.limitMinutes) * 100);

              return (
                <div 
                  key={task.id} 
                  className="p-5 border border-gray-150 rounded-2xl hover:border-gray-200 transition-all space-y-4 bg-gray-50/20"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    
                    {/* Title and reference */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          {task.id}
                        </span>
                        <span className="font-extrabold text-gray-900">{task.title}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">{task.location} • {task.district}</p>
                    </div>

                    {/* Countdown HUD details */}
                    <div className="flex gap-6 font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold font-sans">Elapsed</span>
                        <span className="font-bold text-gray-700">{entry.elapsedMinutes} mins</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold font-sans">Time Left</span>
                        <span className={`font-black ${entry.status === 'Breached' ? 'text-red-500' : entry.status === 'Warning' ? 'text-amber-500' : 'text-emerald-600'}`}>
                          {entry.remainingMinutes} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold font-sans">SLA status</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSLAStatusBadge(entry.status)}`}>
                          {entry.status}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Progress Meter Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-150">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          entry.status === 'Breached' 
                            ? 'bg-red-500' 
                            : entry.status === 'Warning' 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-mono">
                      <span>0m (Dispatch)</span>
                      <span>SLA Threshold Limit ({entry.limitMinutes}m)</span>
                    </div>
                  </div>

                  {/* Footer Action to Expedite */}
                  {entry.status !== 'Breached' && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        <span>Assigned Operator: <span className="font-bold text-gray-700">{task.assignedSupervisor}</span> ({task.vesselNo})</span>
                      </div>

                      <button
                        onClick={() => onExpediteTask(task.id)}
                        className="px-3.5 py-1.5 bg-white hover:bg-orange-50 hover:text-orange-600 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-150 hover:border-orange-200 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Expedite dispatch</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
